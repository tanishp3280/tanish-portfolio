'use client';
import {useEffect,useRef} from 'react';
import {onFrame,runtime} from '@/lib/spatial';
import {cityDirector} from '@/lib/city/director';
/** Elastic outline and magnetic hover inspired by the reference, implemented locally. */
export default function FunCursor(){const host=useRef<HTMLDivElement>(null);useEffect(()=>{
 const el=host.current!,ring=el.querySelector<HTMLElement>('.elastic-ring')!,dot=el.querySelector<HTMLElement>('.elastic-dot')!;
 const media=matchMedia('(hover:hover) and (pointer:fine)'),motion=matchMedia('(prefers-reduced-motion:reduce)');
 const ink=el.querySelector<SVGPathElement>('.cursor-ink path')!;const trails=Array.from(el.querySelectorAll<HTMLElement>('.cursor-petal'));const trailPoints=trails.map(()=>({x:0,y:0}));
 let x=0,y=0,px=0,py=0,vx=0,vy=0,w=50,h=50,radius=25,active=false,target:HTMLElement|null=null,originalTranslate='',mx=0,my=0,bounds:DOMRect|null=null,boundsScroll=-1;
 const release=()=>{if(target)target.style.translate=originalTranslate;target=null;bounds=null;mx=my=0};
 const hide=()=>{active=false;el.style.opacity='0';document.documentElement.removeAttribute('data-elastic-cursor');release()};
 const move=(e:PointerEvent)=>{
  if(e.pointerType==='touch'||!media.matches||motion.matches||runtime.reduced){hide();return}
  const hit=e.target instanceof Element?e.target:null;
  if(document.querySelector('dialog[open]')||hit?.closest('input,textarea,select,[contenteditable=true],[data-no-custom-cursor=true],iframe')){hide();return}
  el.dataset.context=hit?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor||(hit?.closest('.keyboard-wrap')?'PRESS':'');x=e.clientX;y=e.clientY;dot.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;el.style.setProperty('--cursor-x',x+'px');el.style.setProperty('--cursor-y',y+'px');if(!active){px=x;py=y;vx=vy=0;trailPoints.forEach(p=>{p.x=x;p.y=y});active=true}el.style.opacity='1';document.documentElement.setAttribute('data-elastic-cursor','');
  const next=hit?.closest<HTMLElement>('a,button,[role=button],summary')||null;
  if(next!==target){release();if(next&&!next.matches(':disabled,[aria-disabled=true]')){target=next;originalTranslate=next.style.translate}}
 };
 const stop=onFrame(dt=>{
  if(!active)return;if(document.querySelector('dialog[open]')||runtime.reduced||motion.matches||!media.matches){hide();return}
  const step=Math.min(dt,.032),blend=1-Math.exp(-step*18);let tx=x,ty=y,tw=28,th=28,tr=14;
  if(target&&!target.isConnected)release();
  // Keep the pointer attached to the hand; never pull text or buttons out of place.
  if(target){tw=40;th=40;tr=20;}

  vx+=(tx-px)*340*step;vy+=(ty-py)*340*step;const damping=Math.exp(-22*step);vx*=damping;vy*=damping;px+=vx*step;py+=vy*step;
  const stretch=target?0:Math.min(Math.hypot(vx,vy)/2200,.32),angle=target?0:Math.atan2(vy,vx)*180/Math.PI;
  w+=(tw-w)*blend;h+=(th-h)*blend;radius+=(tr-radius)*blend;
  ring.style.width=w+'px';ring.style.height=h+'px';ring.style.borderRadius=radius+'px';ring.style.transform=`translate(${px}px,${py}px) translate(-50%,-50%) rotate(${angle}deg) scale(${1+stretch},${1-stretch*.7})`;
  dot.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;dot.style.opacity='1';trails.forEach((petal,i)=>{const prior=i?trailPoints[i-1]:{x:px,y:py};const point=trailPoints[i];point.x+=(prior.x-point.x)*blend;point.y+=(prior.y-point.y)*blend;petal.style.transform=`translate(${point.x}px,${point.y}px) rotate(${i*35+px*.1}deg)`;petal.style.opacity=target?'0':String(.32-i*.045)});el.dataset.hover=target?'true':'false';const brush=cityDirector.get().brush;ink.style.opacity=brush&&!target?'.5':'0';if(brush){ink.setAttribute('d',`M${x},${y} `+trailPoints.map(p=>`L${p.x},${p.y}`).join(' '));ink.setAttribute('stroke-width',String(Math.max(1,7-Math.hypot(vx,vy)/350)))}
 });
 document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);media.addEventListener('change',hide);motion.addEventListener('change',hide);
 return()=>{hide();stop();document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',hide);window.removeEventListener('blur',hide);media.removeEventListener('change',hide);motion.removeEventListener('change',hide)};
 },[]);return <div className="elastic-cursor" ref={host} aria-hidden="true"><svg className="cursor-ink"><path fill="none" stroke="#678362" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="elastic-ring"/><span className="elastic-dot"/>{Array.from({length:5},(_,i)=><i key={i} className="cursor-petal"/>)}</div>}
