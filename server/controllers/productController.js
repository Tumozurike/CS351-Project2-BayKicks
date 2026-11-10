import Product from '../models/Product.js';
export async function listProducts(req,res){res.json(await Product.find().sort({id:1}).lean());}
export async function getProduct(req,res){const p=await Product.findOne({$or:[...( /^\d+$/.test(req.params.id)?[{id:Number(req.params.id)}]:[]),...( /^[0-9a-f]{24}$/i.test(req.params.id)?[{_id:req.params.id}]:[])]});if(!p)return res.status(404).json({error:'Product not found.'});res.json(p);}
