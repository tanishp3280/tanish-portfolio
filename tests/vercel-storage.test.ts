import test from 'node:test';
import assert from 'node:assert/strict';
import {binding} from '../db/binding.ts';

test('storage requires explicit configuration and preserves bound parameters', async()=>{
 const keys=['CLOUDFLARE_ACCOUNT_ID','CLOUDFLARE_D1_DATABASE_ID','CLOUDFLARE_D1_API_TOKEN'];
 const previous=keys.map(key=>process.env[key]),originalFetch=globalThis.fetch;
 try{
  keys.forEach(key=>delete process.env[key]);assert.throws(()=>binding(),/configuration/);
  keys.forEach((key,index)=>process.env[key]=['account-test','database-test','token-test'][index]);
  let captured:RequestInit|undefined;
  globalThis.fetch=async(_url,init)=>{captured=init;return Response.json({success:true,result:[{success:true,results:[{count:4}]}]})};
  const row=await binding().prepare('SELECT ? AS count').bind(4).first<{count:number}>();
  assert.equal(row?.count,4);assert.deepEqual(JSON.parse(String(captured?.body)),{sql:'SELECT ? AS count',params:[4]});assert.equal(captured?.cache,'no-store');
  globalThis.fetch=async()=>Response.json({success:false},{status:403});
  await assert.rejects(binding().prepare('SELECT 1').all(),/Database query failed/);
 }finally{globalThis.fetch=originalFetch;keys.forEach((key,index)=>{if(previous[index]===undefined)delete process.env[key];else process.env[key]=previous[index]})}
});
