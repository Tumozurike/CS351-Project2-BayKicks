import mongoose from 'mongoose';
const schema = new mongoose.Schema({ id: {type:Number, unique:true}, sku:{type:String,unique:true}, name:String, brand:String, category:String, price:Number, salePrice:Number, currency:{type:String,default:'USD'}, description:String, longDescription:String, gender:String, colors:[String], sizes:[Number], material:String, quantityInStock:Number, rating:Number, numberOfReviews:Number, freeShipping:Boolean, featuredProduct:Boolean, newArrival:Boolean, image:String, thumbnail:String },{timestamps:true});
export default mongoose.model('Product',schema);
