import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import products from '../data/seedProducts.json' with {type:'json'};
if(!process.env.MONGODB_URI)throw new Error('Set MONGODB_URI first');
await mongoose.connect(process.env.MONGODB_URI);
for(const product of products)await Product.updateOne({sku:product.sku},{$set:product},{upsert:true});
console.log(`Seeded ${products.length} products`);await mongoose.disconnect();
