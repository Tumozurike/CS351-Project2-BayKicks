import test from 'node:test';import assert from 'node:assert/strict';
import {emailOk,validAddress,money} from '../utils/validation.js';
test('email validation',()=>{assert.equal(emailOk('test@example.com'),true);assert.equal(emailOk('invalid'),false)});
test('address validation',()=>{assert.equal(Boolean(validAddress({street:'123 A',city:'Oakland',state:'CA',zip:'94601'})),true);assert.equal(Boolean(validAddress({street:'',city:'Oakland',state:'CA',zip:'94601'})),false)});
test('money rounding',()=>assert.equal(money(0.1+0.2),0.3));
