import React,{useEffect,useState} from 'react';
import {api} from './api';
import NavBar from './components/NavBar';
import HomeView from './views/HomeView';
import ShopView from './views/ShopView';
import ProductDetailView from './views/ProductDetailView';
import AccountView from './views/AccountView';
import CreateAccountView from './views/CreateAccountView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrdersView from './views/OrdersView';
import ConfirmationView from './views/ConfirmationView';
export default function App(){
 const [view,setView]=useState('home'),[selected,setSelected]=useState(null),[products,setProducts]=useState([]),[cart,setCart]=useState({items:[],count:0,subtotal:0}),[user,setUser]=useState(null),[order,setOrder]=useState(null),[error,setError]=useState('');
 const go=v=>{setError('');setView(v)};
 useEffect(()=>{api('/api/products').then(setProducts).catch(e=>setError(e.message));api('/api/cart').then(setCart).catch(e=>setError(e.message));api('/api/account').then(d=>setUser(d.user)).catch(()=>{});},[]);
 async function add(item){const data=await api('/api/cart',{method:'POST',body:JSON.stringify({productId:item._id,size:item.size,color:item.color,quantity:item.quantity})});setCart(data);}
 async function change(item,delta){try{setCart(await api(`/api/cart/${item.itemId}`,{method:'PUT',body:JSON.stringify({quantity:item.quantity+delta})}));}catch(e){setError(e.message)}}
 async function remove(item){try{setCart(await api(`/api/cart/${item.itemId}`,{method:'DELETE'}));}catch(e){setError(e.message)}}
 async function logout(){await api('/api/logout',{method:'POST'});setUser(null);go('home')}
 return <><NavBar go={go} count={cart.count}/><main>{error&&<div className="container mt-3 alert alert-danger" role="alert">{error}<button className="btn-close float-end" onClick={()=>setError('')} aria-label="Close"/></div>}
 {view==='home'&&<HomeView go={go}/>}
 {view==='shop'&&<ShopView products={products} open={p=>{setSelected(p);go('detail')}}/>}
 {view==='detail'&&<ProductDetailView key={selected?._id} product={selected} add={add} go={go}/>}
 {view==='account'&&<AccountView user={user} setUser={setUser} go={go} logout={logout}/>}
 {view==='create'&&<CreateAccountView go={go}/>}
 {view==='cart'&&<CartView items={cart.items} change={change} remove={remove} go={go}/>}
 {view==='checkout'&&<CheckoutView user={user} cart={cart} go={go} onOrder={o=>{setOrder(o);setCart({items:[],count:0,subtotal:0});go('confirmation')}}/>}
 {view==='confirmation'&&<ConfirmationView order={order} go={go}/>}
 {view==='orders'&&<OrdersView go={go}/>}
 </main><footer className="py-4 text-center bg-dark text-white mt-5">© 2026 Bay Kicks • CS351 Project 2</footer></>;
}
