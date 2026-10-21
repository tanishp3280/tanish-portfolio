export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
export const sd=a=>{const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)));};
export const cov=(a,b)=>{const x=mean(a),y=mean(b);return a.reduce((s,v,i)=>s+(v-x)*(b[i]-y),0)/(a.length-1)};
export const corr=(a,b)=>{const den=Math.sqrt(cov(a,a)*cov(b,b));return den>0?Math.max(-1,Math.min(1,cov(a,b)/den)):0};
export const quantile=(a,p)=>{const b=[...a].sort((x,y)=>x-y),i=(b.length-1)*p,l=Math.floor(i);return b[l]+((b[l+1]??b[l])-b[l])*(i-l)};
export const seeded=(seed=42)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
export const normal=(r)=>{const u=Math.max(r(),1e-9),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
export const fmt=(x,d=2)=>Number.isFinite(x)?x.toFixed(d):'—';
export const pct=(x,d=1)=>`${(100*x).toFixed(d)}%`;
export function cholesky(a){const n=a.length,l=Array.from({length:n},()=>Array(n).fill(0));for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=0;for(let k=0;k<j;k++)s+=l[i][k]*l[j][k];l[i][j]=i===j?Math.sqrt(Math.max(a[i][i]-s,1e-10)):(a[i][j]-s)/l[j][j]}return l}
export function matVec(a,x){return a.map(r=>r.reduce((s,v,i)=>s+v*x[i],0))}
export function erf(x){const t=1/(1+.3275911*Math.abs(x)),a=[.254829592,-.284496736,1.421413741,-1.453152027,1.061405429];let y=1-(((((a[4]*t+a[3])*t+a[2])*t+a[1])*t+a[0])*t)*Math.exp(-x*x);return x<0?-y:y}
export const N=x=>(1+erf(x/Math.sqrt(2)))/2;
export function bs(S,K,T,r,v,call=true){const d1=(Math.log(S/K)+(r+.5*v*v)*T)/(v*Math.sqrt(T)),d2=d1-v*Math.sqrt(T);return call?S*N(d1)-K*Math.exp(-r*T)*N(d2):K*Math.exp(-r*T)*N(-d2)-S*N(-d1)}
