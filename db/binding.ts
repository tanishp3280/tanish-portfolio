/** Server-only D1 HTTP adapter for hosting the application on Vercel. */
export function binding(){
 const account=process.env.CLOUDFLARE_ACCOUNT_ID,database=process.env.CLOUDFLARE_D1_DATABASE_ID,token=process.env.CLOUDFLARE_D1_API_TOKEN;
 if(!account||!database||!token)throw Error('Guestbook and visitor statistics require database configuration.');
 function prepare(sql:string,params:unknown[]=[]){
  async function query<T=Record<string,unknown>>(){
   const response=await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account!)}/d1/database/${encodeURIComponent(database!)}/query`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({sql,params}),cache:'no-store',signal:AbortSignal.timeout(10000)});
   const data=await response.json() as {success:boolean;result?:{success:boolean;results:T[]}[]};
   if(!response.ok||!data.success||!data.result?.[0]?.success)throw Error('Database query failed.');
   return data.result[0];
  }
  return{bind:(...values:unknown[])=>prepare(sql,values),all:<T=Record<string,unknown>>()=>query<T>(),first:async<T=Record<string,unknown>>()=>(await query<T>()).results[0]??null,run:()=>query()};
 }
 return{prepare};
}
