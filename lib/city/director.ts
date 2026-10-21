'use client';
import {useSyncExternalStore} from 'react';
export const sequences={bridges:{title:'The seven bridges junction',duration:18},elevator:{title:'Ride the cliffside elevator',duration:18},shadow:{title:'Momo’s shadow theatre',duration:16},forge:{title:'The project transformation forge',duration:18},spiral:{title:'Spiral around the pagoda',duration:20},timeline:{title:'My story in mountain layers',duration:22},future:{title:'The next construction site',duration:15},calligraphy:{title:'The calligraphy workshop',duration:15},architecture:{title:'Couriers through the software castle',duration:15},awakening:{title:'Grand mountain awakening',duration:24},origami:{title:'The mountain unfolds',duration:15},pagoda:{title:'Floating pagoda assembly',duration:12},lanterns:{title:'Lantern festival',duration:16},cranes:{title:'Paper crane migration',duration:16},wind:{title:'Wind through the city',duration:12},guardian:{title:'The mountain guardian',duration:15},train:{title:'Spirit train journey',duration:24},moon:{title:'Hidden moon garden',duration:15},clock:{title:'Inside the mountain clock',duration:16},fan:{title:'City inside a paper fan',duration:15},reflection:{title:'The inverted temple',duration:15},waterfall:{title:'Behind the waterfall',duration:15},bamboo:{title:'Bamboo time-lapse',duration:13},ink:{title:'The ink river',duration:14},petal:{title:'Follow a cherry blossom',duration:15},scroll:{title:'A landscape in a scroll',duration:15},doors:{title:'Beyond the paper doors',duration:12},gravity:{title:'The weightless courtyard',duration:15},teacup:{title:'A world inside a teacup',duration:15},scale:{title:'From ink to mountains',duration:20},sky:{title:'Painting the sky',duration:20},energy:{title:'One connected machine',duration:18},apartment:{title:'Momo’s rooftop apartment',duration:18},parkour:{title:'Momo’s bamboo journey',duration:14},gift:{title:'Momo’s origami gift',duration:12}} as const;
export type SequenceId=keyof typeof sequences;
export type Emotion='happy'|'curious'|'surprised'|'confused'|'proud'|'sleepy'|'excited';
export type DirectorState={sequence:SequenceId|null;playing:boolean;progress:number;visited:number[];discoveries:string[];emotion:Emotion;blueprint:boolean;inspector:boolean;brush:boolean;tour:boolean;replay:boolean;active:number;revision:number;skill:string;project:string;skillRevision:number;destination:number};
const initial:DirectorState={sequence:null,playing:false,progress:0,visited:[],discoveries:[],emotion:'curious',blueprint:false,inspector:false,brush:false,tour:false,replay:false,active:0,revision:0,skill:'Python',project:'portfolio-optimizer',skillRevision:0,destination:2};
let state=initial;const subscribers=new Set<()=>void>();let progress=0,lastPublish=0,initialized=false;
const emit=(patch:Partial<DirectorState>)=>{state={...state,...patch};subscribers.forEach(fn=>fn())};
export const cityDirector={
 get:()=>state,
 chooseDestination(destination:number){if(Number.isInteger(destination)&&destination>=0&&destination<11)emit({destination})},
 selectSkill(skill:string){emit({skill,skillRevision:state.skillRevision+1});this.discover('skill:'+skill)},
 selectProject(project:string){emit({project});this.discover('project:'+project)},
 hydrate(){if(initialized)return;initialized=true;try{const stored=JSON.parse(sessionStorage.getItem('mountain-memory')||'{}');emit({visited:Array.isArray(stored.visited)?stored.visited.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<11):[],discoveries:Array.isArray(stored.discoveries)?stored.discoveries.filter((s:unknown)=>typeof s==='string'):[]})}catch{}},
 visit(index:number){if(state.active===index&&state.visited.includes(index))return;emit({active:index,visited:[...new Set([...state.visited,index])],emotion:({2:'curious',4:'excited',7:'proud',9:'happy',10:'proud'} as Record<number,Emotion>)[index]||'curious'});this.save()},
 discover(id:string){if(state.discoveries.includes(id))return;emit({discoveries:[...state.discoveries,id],emotion:'excited'});this.save()},
 save(){try{sessionStorage.setItem('mountain-memory',JSON.stringify({visited:state.visited,discoveries:state.discoveries}))}catch{}},
 play(id:SequenceId){progress=0;lastPublish=0;emit({tour:false,replay:false,sequence:id,playing:true,progress:0,revision:state.revision+1,emotion:id==='gift'?'proud':'excited'});this.discover(id)},
 pause(){emit({playing:!state.playing})},
 stop(){progress=0;emit({sequence:null,playing:false,progress:0,tour:false,replay:false,emotion:'curious'})},
 seek(value:number){if(!Number.isFinite(value))return;progress=Math.max(0,Math.min(1,value));lastPublish=progress;emit({progress,playing:false})},
 set(patch:Partial<Pick<DirectorState,'blueprint'|'inspector'|'brush'|'emotion'|'tour'|'replay'>>){emit(patch)},
 tick(dt:number,reduced:boolean){if(reduced&&state.sequence&&state.playing){progress=1;lastPublish=1;emit({progress:1,playing:false})}if(state.sequence&&state.playing&&!reduced){progress=Math.min(1,progress+Math.max(0,Math.min(dt,.05))/sequences[state.sequence].duration);if(progress-lastPublish>.025||progress===1){lastPublish=progress;emit({progress,playing:progress<1})}}return {...state,progress}},
};
export function useCityDirector(){return useSyncExternalStore(fn=>{subscribers.add(fn);return()=>{subscribers.delete(fn)}},()=>state,()=>initial)}
export const ease=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t)};
export const phase=(p:number,start=0,end=1)=>ease((p-start)/(end-start));
