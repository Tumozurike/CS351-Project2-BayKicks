import Product from '../models/Product.js';
import crypto from 'node:crypto';
import {money} from '../utils/validation.js';
const getCart=req=>req.session.cart||[];
export const cartResponse=req=>({items:getCart(req),subtotal:money(getCart(req).reduce((s,i)=>s+i.price*i.quantity,0)),count:getCart(req).reduce((s,i)=>s+i.quantity,0)});
export function showCart(req,res){res.json(cartResponse(req));}
export async function addCart(req,res){
 const {productId,size,color,quantity}=req.body;
 if(!Number.isInteger(Number(quantity))||Number(quantity)<1||Number(quantity)>100)return res.status(400).json({error:'Quantity must be 1-100.'});
 const product=await Product.findOne({$or:[...( /^\d+$/.test(String(productId))?[{id:Number(productId)}]:[]),...( /^[0-9a-f]{24}$/i.test(String(productId))?[{_id:productId}]:[])]});
 if(!product)return res.status(404).json({error:'Product not found.'});
 if(!product.sizes.map(String).includes(String(size))||!product.colors.includes(color))return res.status(400).json({error:'Choose a valid size and color.'});
 const cart=getCart(req);const existing=cart.find(i=>i.productId===String(product._id)&&i.size===String(size)&&i.color===color);
 const total=Number(quantity)+(existing?.quantity||0);if(total>product.quantityInStock)return res.status(400).json({error:'Not enough stock.'});
 if(existing)existing.quantity=total;else cart.push({itemId:crypto.randomUUID(),productId:String(product._id),name:product.name,brand:product.brand,image:product.image,size:String(size),color,quantity:Number(quantity),price:product.salePrice??product.price});
 req.session.cart=cart;res.json(cartResponse(req));
}
export async function changeCart(req,res){const cart=getCart(req),item=cart.find(i=>i.itemId===req.params.itemId);if(!item)return res.status(404).json({error:'Cart item not found.'});const quantity=Number(req.body.quantity);if(!Number.isInteger(quantity)||quantity<1||quantity>100)return res.status(400).json({error:'Invalid quantity.'});const p=await Product.findById(item.productId);if(!p||quantity>p.quantityInStock)return res.status(400).json({error:'Not enough stock.'});item.quantity=quantity;res.json(cartResponse(req));}
export function removeCart(req,res){req.session.cart=getCart(req).filter(i=>i.itemId!==req.params.itemId);res.json(cartResponse(req));}
