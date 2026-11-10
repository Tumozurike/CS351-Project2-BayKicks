import React,{useState} from 'react';
import ProductList from '../components/ProductList';
export default function ShopView({products,open}){
 const [page,setPage]=useState(1),per=10,total=Math.ceil(products.length/per),shown=products.slice((page-1)*per,page*per);
 return <div className="container py-5"><h1>Shop</h1><p className="text-muted">{products.length} sneakers • click any product for details</p><ProductList products={shown} open={open}/><div className="d-flex justify-content-center gap-2 mt-5">{Array.from({length:total},(_,i)=><button key={i} className={'btn '+(page===i+1?'btn-dark':'btn-outline-dark')} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div></div>;
}
