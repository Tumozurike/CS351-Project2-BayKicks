import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import productRoutes from './routes/productRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import {errors} from './middleware/errors.js';
export function createApp(){
 const app=express();app.set('trust proxy',1);app.use(helmet({contentSecurityPolicy:false}));app.use(express.json({limit:'100kb'}));
 app.use(session({name:'baykicks.sid',secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,store:MongoStore.create({mongoUrl:process.env.MONGODB_URI,collectionName:'sessions'}),cookie:{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:24*60*60*1000}}));
 app.use('/api/products',productRoutes);app.use('/api',accountRoutes);app.use('/api/cart',cartRoutes);app.use('/api/orders',orderRoutes);
 app.use('/api',(_req,res)=>res.status(404).json({error:'API endpoint not found.'}));
 const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../client/dist');
 app.use(express.static(dist));app.get('/{*path}',(_req,res)=>res.sendFile(path.join(dist,'index.html')));
 app.use(errors);return app;
}
