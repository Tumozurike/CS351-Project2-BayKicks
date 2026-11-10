export const emailOk = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
export const validAddress = a => a && ['street','city','state','zip'].every(k => typeof a[k] === 'string' && a[k].trim()) && /^[A-Za-z]{2}$/.test(a.state) && /^\d{5}(-\d{4})?$/.test(a.zip);
export const money = n => Math.round((n + Number.EPSILON) * 100) / 100;
export const publicUser = u => ({id:String(u._id),username:u.username,email:u.email,firstName:u.firstName,lastName:u.lastName,phone:u.phone,shippingAddress:u.shippingAddress,billingAddress:u.billingAddress});
export const requiredName = n => typeof n === 'string' && n.trim().length >= 1 && n.trim().length <= 80;
