'use client';
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {useSettings} from '../Shell';
import {LivingDescription,StoryBubble} from './LivingText';
import ScrollPassage from './ScrollPassage';
import ResearchPlayground from './ResearchPlayground';
export type StoryBeat={id?:string;label:string;title:string;detail:string;metric?:string;href?:string;link?:string;explore?:{title:string;detail:string;href?:string};experiment?:boolean};
/** Native scrolling with alternating spatial passages and reversible reveals. */
export default function StorySequence({label,beats}:{label:string;beats:StoryBeat[]}){
 const {reduced}=useSettings(),os=useReducedMotion();const quiet=reduced||os;
 const host=useRef<HTMLDivElement>(null),[current,setCurrent]=useState(0),[visible,setVisible]=useState(false);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:'-90px 0px -35% 0px'});observer.observe(host.current!);return()=>observer.disconnect()},[]);
 useEffect(()=>{const nodes=Array.from(host.current!.querySelectorAll<HTMLElement>('.story-beat'));const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setCurrent(Number((entry.target as HTMLElement).dataset.beat));},{rootMargin:'-25% 0px -45% 0px',threshold:0});nodes.forEach(n=>observer.observe(n));return()=>observer.disconnect()},[beats.length]);
 return <div className="story-sequence" ref={host}><nav className="story-thread" data-visible={visible} aria-label={label+' story steps'}><span>{label}</span><div>{beats.map((b,i)=><a key={b.title} href={'#'+(b.id||label.toLowerCase().replaceAll(' ','-')+'-'+i)} aria-label={b.title} aria-current={current===i?'step':undefined}><span>{String(i+1).padStart(2,'0')}</span></a>)}</div></nav><div className="story-beats">{beats.map((b,i)=><article key={b.title} data-placement={["left","right","center"][i%3]} id={b.id||label.toLowerCase().replaceAll(' ','-')+'-'+i} className="story-beat" data-beat={i} data-current={current===i} tabIndex={-1}><ScrollPassage index={i}><p className="story-label">{b.label}</p>{b.metric&&<strong className="story-metric">{b.metric}</strong>}<h3>{b.title}</h3>{b.detail.split(/;|\. /).length>1&&<LivingDescription text={b.detail.split(/;|\. /)[0]+'.'}/>}<StoryBubble title={b.title} text={b.explore?.detail||b.detail} index={i}/>{b.href&&<a className="journey-text-link" href={b.href}>{b.link||'Explore the work'} ↗</a>}{b.experiment&&<details className="story-extra"><summary>Try a research experiment <span>↗</span></summary><ResearchPlayground/></details>}<div className="story-rule" aria-hidden="true"><i/></div></ScrollPassage></article>)}</div></div>
}
