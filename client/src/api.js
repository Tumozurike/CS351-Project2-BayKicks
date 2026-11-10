// All frontend HTTP requests go through this helper.
export async function api(url,options={}){
 const response=await fetch(url,{credentials:'same-origin',headers:{'Content-Type':'application/json',...options.headers},...options});
 const data=await response.json().catch(()=>({}));
 if(!response.ok)throw new Error(data.error||`Request failed (${response.status})`);
 return data;
}
