'use client';
import {useSyncExternalStore} from 'react';
export type SectionId='hero'|'skills'|'experience'|'research'|'projects'|'contact';
export type Quality='high'|'medium'|'low';
export type CameraState={x:number;y:number;z:number;rotationX:number;rotationY:number;rotationZ:number;fov:number;targetX:number;targetY:number;targetZ:number};
const camera=(x:number,y:number,z:number):CameraState=>({x,y,z,rotationX:0,rotationY:0,rotationZ:0,fov:42,targetX:0,targetY:0,targetZ:0});
export const SECTION_SCENES={
 hero:{label:'FIELD / IDLE',accent:'#b7a0df',pattern:0,camera:camera(0,1,19),keyboard:{x:.15,y:.4,z:-.34},range:[0,.16]},
 skills:{label:'KEYBOARD / ACTIVE',accent:'#b7a0df',pattern:1,camera:camera(1,0,17),keyboard:{x:0,y:Math.PI/12,z:0},range:[.16,.32]},
 experience:{label:'TIMELINE / STREAM',accent:'#b7a0df',pattern:2,camera:camera(-1,2,20),keyboard:{x:.2,y:-Math.PI/4,z:.1},range:[.32,.5]},
 research:{label:'NETWORK / ANALYTICAL',accent:'#b7a0df',pattern:3,camera:camera(1,1,18),keyboard:{x:.3,y:.65,z:0},range:[.5,.66]},
 projects:{label:'GALLERY / DEPTH',accent:'#b7a0df',pattern:4,camera:camera(0,-1,20),keyboard:{x:.15,y:-.18,z:0},range:[.66,.84]},
 contact:{label:'CONVERGENCE / END',accent:'#b7a0df',pattern:5,camera:camera(0,0,16),keyboard:{x:.12,y:.2,z:0},range:[.84,1]}
} as const;
export const sectionIds=Object.keys(SECTION_SCENES) as SectionId[];
export const MAP_NODES=[
{id:'hero',label:'HOME',href:'/',key:'h',position:[0,2,0],related:['skills','experience','contact']},
{id:'skills',label:'STACK',href:'/skills',key:'s',position:[-4,2,1],related:['keyboard','projects','graph']},
{id:'experience',label:'EXPERIENCE',href:'/experience',key:'e',position:[-7,-2,1],related:['projects','research','hero']},
{id:'research',label:'RESEARCH',href:'/research',key:'r',position:[0,0,-2],related:['quant','projects','graph']},
{id:'projects',label:'PROJECTS',href:'/work',key:'p',position:[4,2,1],related:['quant','algorithms','world','keyboard']},
{id:'quant',label:'QUANT',href:'/quant',key:'q',position:[5,-1,-1],related:['projects','research','algorithms']},
{id:'algorithms',label:'ALGORITHMS',href:'/algorithms',key:'a',position:[3,-4,1],related:['quant','projects','terminal']},
{id:'world',label:'WORLD',href:'/world',key:'w',position:[-3,-4,0],related:['skills','projects']},
{id:'terminal',label:'TERMINAL',href:'/terminal',key:'t',position:[0,-3,3],related:['algorithms','projects']},
{id:'community',label:'COMMUNITY',href:'/community',key:'c',position:[-6,4,-2],related:['contact','experience']},
{id:'contact',label:'CONTACT',href:'/contact',key:'o',position:[6,4,-2],related:['hero','community']},
{id:'keyboard',label:'KEYBOARD',href:'/keyboard',key:'k',position:[-4,.5,2],related:['skills','projects']},
{id:'graph',label:'KNOWLEDGE GRAPH',href:'/graph',key:'g',position:[0,5,0],related:['skills','research','experience']}
];
export const PHYSICAL_SKILLS:Record<string,{object?:string;skill:string}>={j:{object:'js',skill:'JavaScript'},t:{object:'ts',skill:'TypeScript'},h:{object:'html',skill:'HTML'},c:{object:'css',skill:'CSS'},r:{object:'react',skill:'React'},v:{object:'vue',skill:'Vue'},f:{object:'firebase',skill:'Firebase'},b:{object:'github',skill:'GitHub'},p:{skill:'Python'},l:{object:'linux',skill:'Linux'},x:{object:'nextjs',skill:'Next.js'},d:{object:'docker',skill:'Docker'},a:{object:'aws',skill:'AWS'}};
export type SpatialState={activeSection:SectionId;activeSkill:string;explorerMode:boolean;mapOpen:boolean;keyboardMapOpen:boolean;quality:Quality;activeKey:string;interactions:number;previewSection:SectionId|null;mapNode:string;arrowNavigation:boolean;secretField:boolean;ready:boolean;researchMode:'neural'|'quant'};
const initial:SpatialState={activeSection:'hero',activeSkill:'',explorerMode:false,mapOpen:false,keyboardMapOpen:false,quality:'medium',activeKey:'',interactions:0,previewSection:null,mapNode:'hero',arrowNavigation:false,secretField:false,ready:false,researchMode:'neural'};
let state=initial;const listeners=new Set<()=>void>();
export function getSpatial(){return state}
export function setSpatial(patch:Partial<SpatialState>){if(Object.entries(patch).every(([k,v])=>state[k as keyof SpatialState]===v))return;state={...state,...patch};listeners.forEach(l=>l())}
export function useSpatial(){return useSyncExternalStore(cb=>{listeners.add(cb);return()=>{listeners.delete(cb)}},()=>state,()=>initial)}
export const runtime={pointer:{x:0,y:0,clientX:0,clientY:0},scrollY:0,progress:0,velocity:0,direction:1,sectionProgress:0,camera:camera(0,1,19),fps:0,pulse:0,elapsed:0,sound:false,reduced:false,theme:'light',menuOpen:false,commandOpen:false,keys:new Set<string>(),worldFocused:false};
export function selectSkill(skill:string,object?:string){setSpatial({activeSkill:skill,interactions:state.interactions+1});runtime.pulse=1;window.dispatchEvent(new CustomEvent('portfolio-skill',{detail:{skill,object}}))}
export function isTextEntry(target:EventTarget|null){return target instanceof Element&&!!target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]')}
export function requestNavigation(href:string){window.dispatchEvent(new CustomEvent('spatial-navigate',{detail:href}))}
export function systemAction(action:string){window.dispatchEvent(new CustomEvent('spatial-action',{detail:action}))}
export const frameListeners=new Set<(dt:number,time:number)=>void>();
export function onFrame(fn:(dt:number,time:number)=>void){frameListeners.add(fn);return()=>{frameListeners.delete(fn)}}
let audioContext:AudioContext|undefined;
export function systemSound(freq=340){if(!runtime.sound)return;try{audioContext??=new AudioContext();const c=audioContext;void c.resume();const o=c.createOscillator(),g=c.createGain();o.type=runtime.theme==='dark'?'triangle':'sine';o.frequency.setValueAtTime(freq,c.currentTime);o.frequency.exponentialRampToValueAtTime(freq*(runtime.theme==='dark'?1.5:.45),c.currentTime+.09);g.gain.setValueAtTime(.018,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+.12);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.13);o.onended=()=>{o.disconnect();g.disconnect()}}catch{}}
