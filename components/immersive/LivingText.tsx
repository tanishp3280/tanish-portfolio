'use client';
import {useId,useRef,useState} from 'react';
import {AnimatePresence,motion,useInView,useReducedMotion} from 'motion/react';
import {useSettings} from '../Shell';

/** Highlight one meaningful phrase without replacing or scrambling the words. */
export function LivingDescription({text}:{text:string}){
 const ref=useRef<HTMLParagraphElement>(null),visible=useInView(ref,{margin:'-8% 0px -8% 0px'}),{reduced}=useSettings(),os=useReducedMotion();
 const parts=text.split(/(\b\d[\d,+×→ ]*|quantitative finance|brain data|mathematics|research|students|engineering|community|Python|JavaScript|robotics)/i);
 return <p ref={ref} className="living-description" data-awake={visible&&!reduced&&!os}>{parts.map((part,i)=>i%2?<mark key={i} style={{animationDelay:`${i*.4}s`}}>{part}</mark>:<span key={i}>{part}</span>)}</p>
}
export function StoryBubble({title,text,index}:{title:string;text:string;index:number}){
 const [open,setOpen]=useState(false),id=useId(),{reduced}=useSettings(),os=useReducedMotion(),ref=useRef<HTMLDivElement>(null),visible=useInView(ref,{amount:.15});const quiet=reduced||os;
 return <div ref={ref} className="story-bubble" data-awake={visible&&!quiet}><motion.button className="story-bubble-trigger" aria-expanded={open} aria-controls={id} onClick={()=>setOpen(v=>!v)} whileTap={quiet?{}:{scale:.95}}><span aria-hidden="true">{['✦','↗','✧'][index%3]}</span>{open?'Close this story':'Tap into the story'}<b aria-hidden="true">{open?'−':'+'}</b></motion.button><AnimatePresence initial={false}>{open&&<motion.div id={id} className="story-bubble-content" initial={{opacity:0,y:quiet?0:16,scale:quiet?1:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:quiet?0:8}} transition={{duration:quiet?0:.3}}><strong>{title}</strong><LivingDescription text={text}/></motion.div>}</AnimatePresence></div>
}
