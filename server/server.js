import 'dotenv/config';
import mongoose from 'mongoose';
import {createApp} from './app.js';
async function startServer(){
 if(!process.env.MONGODB_URI||!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32)throw new Error('Set MONGODB_URI and a SESSION_SECRET of 32+ characters.');
 await mongoose.connect(process.env.MONGODB_URI);
 const server=createApp().listen(process.env.PORT||8080,()=>console.log(`BayKicks API listening on ${process.env.PORT||8080}`));
 async function stop(){server.close();await mongoose.disconnect();process.exit(0);}
 process.on('SIGTERM',stop);process.on('SIGINT',stop);
}
startServer().catch(e=>{console.error(e);process.exit(1)});
