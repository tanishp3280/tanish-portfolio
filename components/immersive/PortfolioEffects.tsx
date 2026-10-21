'use client';
import {lazy,Suspense,useEffect,useRef,useState,useId} from 'react';
import {motion,useInView,useReducedMotion} from 'motion/react';
import {useSettings} from '../Shell';
// Adapted from the supplied Cult UI examples; bounded to visible, decorative areas.
const Dithering=lazy(()=>import('@paper-design/shaders-react').then(m=>({default:m.Dithering})));
export function HeroDithering(){
 const ref=useRef<HTMLDivElement>(null),visible=useInView(ref),systemReduced=useReducedMotion(),{reduced}=useSettings();
 const [awake,setAwake]=useState(true);
 useEffect(()=>{const update=()=>setAwake(!document.hidden);document.addEventListener('visibilitychange',update);return()=>document.removeEventListener('visibilitychange',update)},[]);
 return <div ref={ref} className="portfolio-dither" aria-hidden="true">{visible&&awake&&!reduced&&!systemReduced&&<Suspense fallback={null}><Dithering colorBack="#10101500" colorFront="#b7a0df" shape="swirl" type="4x4" size={3} speed={.16} scale={.6} style={{width:'100%',height:'100%'}}/></Suspense>}</div>
}
export function TextAnimate({text}:{text:string}){
 const systemReduced=useReducedMotion(),{reduced}=useSettings();
 return <motion.span className="portfolio-text-animate" aria-label={text} initial="hidden" whileInView="visible" viewport={{once:true,amount:.4}} variants={{hidden:{},visible:{transition:{staggerChildren:reduced||systemReduced?0:.045}}}}>{text.split(' ').map((word,i)=><motion.span aria-hidden="true" key={i} variants={{hidden:{opacity:reduced||systemReduced?1:0,y:reduced||systemReduced?0:12},visible:{opacity:1,y:0}}} transition={{duration:.4,ease:[.22,1,.36,1]}}>{word}{' '}</motion.span>)}</motion.span>
}
export function DistortedGlass(){const id=useId().replaceAll(':','');return <div className="portfolio-glass" aria-hidden="true"><svg width="0" height="0"><defs><filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.12 0.12" numOctaves="1" result="warp"/><feDisplacementMap in="SourceGraphic" in2="warp" scale="22" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg><div style={{filter:`url(#${id})`}}/></div>}
export function TextGif({text}:{text:string}){const {reduced}=useSettings(),systemReduced=useReducedMotion(),ref=useRef<HTMLSpanElement>(null),visible=useInView(ref),[loaded,setLoaded]=useState(false);useEffect(()=>{const img=new Image();img.onload=()=>setLoaded(true);img.src='/effects/lavender-flow.gif';return()=>{img.onload=null}},[]);return <span ref={ref} className="portfolio-text-gif" style={loaded?{backgroundImage:`url(/effects/lavender-flow.${reduced||systemReduced||!visible?'png':'gif'})`}:undefined}>{text}</span>}
