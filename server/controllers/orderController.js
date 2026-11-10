import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import {validAddress,money} from '../utils/validation.js';
export async function createOrder(req,res){
 const cart=req.session.cart||[];if(!cart.length)return res.status(400).json({error:'Cart is empty.'});
 const user=await User.findById(req.session.userId);if(!user)return res.status(401).json({error:'Please log in.'});
 const {shippingAddress,billingAddress,payment}=req.body;
 if(!validAddress(shippingAddress)||!validAddress(billingAddress))return res.status(400).json({error:'Valid shipping and billing addresses required.'});
 // Demo payment only. Never accept or store full card numbers or CVV.
 if(!payment||!['Visa','Mastercard','Amex','Discover','Demo'].includes(payment.cardType)||!/^\d{4}$/.test(String(payment.last4)))return res.status(400).json({error:'Choose a card type and provide only the last four digits.'});
 const items=[];
 for(const item of cart){
  const p=await Product.findById(item.productId);
  if(!p||!p.sizes.map(String).includes(item.size)||!p.colors.includes(item.color)||!Number.isInteger(item.quantity)||item.quantity<1||p.quantityInStock<item.quantity)return res.status(400).json({error:`Product unavailable or out of stock: ${item.name}`});
  const unitPrice=p.salePrice??p.price;
  items.push({productId:p._id,name:p.name,brand:p.brand,image:p.image,size:item.size,color:item.color,quantity:item.quantity,unitPrice,lineTotal:money(unitPrice*item.quantity)});
 }
 const subtotal=money(items.reduce((sum,i)=>sum+i.lineTotal,0));const tax=money(subtotal*0.0875);const shippingCost=subtotal>=100?0:8;const total=money(subtotal+tax+shippingCost);
 const order=await Order.create({userId:user._id,customer:{firstName:user.firstName,lastName:user.lastName,email:user.email,phone:user.phone},shippingAddress,billingAddress,payment:{cardType:payment.cardType,last4:String(payment.last4)},items,subtotal,tax,shippingCost,total});
 req.session.cart=[];res.status(201).json({order});
}
export async function listOrders(req,res){res.json(await Order.find({userId:req.session.userId}).sort({orderDate:-1}).lean());}
export async function getOrder(req,res){if(!/^[a-f\d]{24}$/i.test(req.params.id))return res.status(400).json({error:'Invalid order ID.'});const order=await Order.findOne({_id:req.params.id,userId:req.session.userId});if(!order)return res.status(404).json({error:'Order not found.'});res.json(order);}
