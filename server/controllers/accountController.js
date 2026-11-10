import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {emailOk,validAddress,publicUser,requiredName} from '../utils/validation.js';
const cleanEmail = e => String(e || '').trim().toLowerCase();
const cleanUsername = u => String(u || '').trim();
export async function register(req,res){
 const {username,email,password,firstName,lastName,phone='',shippingAddress,billingAddress} = req.body;
 if(!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername(username)) || !emailOk(email) || typeof password!=='string' || password.length<8 || password.length>128 || !requiredName(firstName) || !requiredName(lastName) || !validAddress(shippingAddress) || (billingAddress && !validAddress(billingAddress)) || (phone && !/^[0-9 ()+\-]{7,20}$/.test(phone)))return res.status(400).json({error:'Check username (3-30 letters/numbers), email, password (8+), names and shipping address.'});
 const exists=await User.findOne({$or:[{username:cleanUsername(username)},{email:cleanEmail(email)}]});
 if(exists)return res.status(409).json({error:'Username or email already exists.'});
 await User.create({username:cleanUsername(username),email:cleanEmail(email),passwordHash:await bcrypt.hash(password,12),firstName:firstName.trim(),lastName:lastName.trim(),phone,shippingAddress,billingAddress:billingAddress||shippingAddress});
 res.status(201).json({message:'Account created. Please log in.'});
}
export async function login(req,res,next){
 const {email,password}=req.body;
 if(!emailOk(email)||typeof password!=='string')return res.status(400).json({error:'Email and password required.'});
 const user=await User.findOne({email:cleanEmail(email)});
 if(!user||!(await bcrypt.compare(password,user.passwordHash)))return res.status(401).json({error:'Incorrect email or password.'});
 req.session.regenerate(err=>{if(err)return next(err);req.session.userId=String(user._id);req.session.save(err=>err?next(err):res.json({user:publicUser(user)}));});
}
export function logout(req,res,next){req.session.destroy(err=>{if(err)return next(err);res.clearCookie('baykicks.sid');res.json({message:'Logged out.'});});}
export async function getAccount(req,res){const user=await User.findById(req.session.userId);if(!user)return res.status(401).json({error:'Account not found.'});res.json({user:publicUser(user)});}
export async function updateAccount(req,res){
 const allowed=['username','email','firstName','lastName','phone','shippingAddress','billingAddress'];const changes=Object.fromEntries(Object.entries(req.body).filter(([k])=>allowed.includes(k)));
 if(changes.username!==undefined&&!/^[a-zA-Z0-9_]{3,30}$/.test(changes.username))return res.status(400).json({error:'Invalid username.'});
 if(changes.email!==undefined&&!emailOk(changes.email))return res.status(400).json({error:'Invalid email.'});
 for(const key of ['firstName','lastName'])if(changes[key]!==undefined&&!requiredName(changes[key]))return res.status(400).json({error:`Invalid ${key}.`});
 for(const key of ['shippingAddress','billingAddress'])if(changes[key]!==undefined&&!validAddress(changes[key]))return res.status(400).json({error:`Invalid ${key}.`});
 if(changes.phone!==undefined&&changes.phone!==''&&!/^[0-9 ()+\-]{7,20}$/.test(changes.phone))return res.status(400).json({error:'Invalid phone.'});
 if(changes.email)changes.email=cleanEmail(changes.email);
 const conflict=await User.findOne({$or:[...(changes.email?[{email:changes.email}]:[]),...(changes.username?[{username:changes.username}]:[])] ,_id:{$ne:req.session.userId}});
 if(conflict)return res.status(409).json({error:'Username or email already taken.'});
 const user=await User.findByIdAndUpdate(req.session.userId,{$set:changes},{new:true,runValidators:true});
 if(!user)return res.status(401).json({error:'Account not found.'});res.json({user:publicUser(user)});
}
