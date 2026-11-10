import mongoose from 'mongoose';
const address = {street:{type:String,default:''},city:{type:String,default:''},state:{type:String,default:''},zip:{type:String,default:''}};
const schema = new mongoose.Schema({username:{type:String,required:true,unique:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},passwordHash:{type:String,required:true},firstName:{type:String,required:true},lastName:{type:String,required:true},phone:{type:String,default:''},shippingAddress:address,billingAddress:address},{timestamps:true});
export default mongoose.model('User',schema);
