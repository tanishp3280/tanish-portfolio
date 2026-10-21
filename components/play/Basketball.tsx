'use client';
import {useCallback,useRef,useState} from 'react';
import * as T from 'three';
import {launchShot,stepShot,type Shot} from '@/lib/play/basketball';
import {runtime} from '@/lib/spatial';
import Stage,{type StageContext} from './Stage';
import {box,ball,ring,person} from '../sky/models';
const rooftops=['Garden court','Lantern rooftop','Summit court'];
export default function Basketball(){
 const [position,setPosition]=useState(0),[aim,setAim]=useState(0),[power,setPower]=useState(65),[score,setScore]=useState(0),[shots,setShots]=useState(0),[busy,setBusy]=useState(false),[roof,setRoof]=useState(0),[cleared,setCleared]=useState<number[]>([]),[message,setMessage]=useState('A rooftop journey: make a basket to unlock the next court. Start near 65% power.');
 const state=useRef({aim,power,position,roof});state.current={aim,power,position,roof};const fire=useRef(()=>{});
 const build=useCallback((scene:T.Scene,{camera,controls}:StageContext)=>{
  const offsets=[new T.Vector3(),new T.Vector3(15,4,-3),new T.Vector3(30,8,-6)];
  const courts=offsets.map((offset,index)=>{
   const g=new T.Group();g.position.copy(offset);scene.add(g);
   box(g,0,-1.7,0,10,3.2,13,0xd9ded2);box(g,0,-.1,0,10,.2,13,0xa7cbd7);
   for(const x of [-4.5,4.5]){box(g,x,.02,0,.04,.02,12,0xffffff);for(let i=0;i<6;i++)box(g,x,.5,i*2-5,.08,1,.08,0x55786a);box(g,x,1,0,.08,.08,12,0x55786a)}
   for(const z of [-6,6])box(g,0,.02,z,9,.02,.04,0xffffff);
   for(let i=0;i<5;i++)box(g,-4+i*2,-1.5,6.51,.7,1,.03,0xabc49f);
   box(g,0,1.9,-5,.15,3.8,.15,0x284c70);box(g,0,3.35,-4.9,2.2,1.4,.12,0xffffff);box(g,0,3.2,-4.82,.8,.55,.04,0x75a7cd);
   const hoop=ring(g,.5,.045,0xd5b08f);hoop.rotation.x=Math.PI/2;hoop.position.set(0,2.9,-4.25);
   const net=new T.Group();g.add(net);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;box(net,Math.cos(a)*.44,2.65,-4.25+Math.sin(a)*.44,.025,.5,.025,0xffffff)}
   const player=person(g,0,4.6,.95);const b=ball(g,0,1.4,4,.28,0xe8ab6e);b.add(ring(g,.282,.012,0x294763));
   if(index<2){const bridge=box(g,7.5,1.3,-1.5,5,.2,1.5,0x807d69);bridge.rotation.z=.25;}
   return {g,player,b,net};
  });
  let shot:Shot|null=null,shotRoof=0,release=-100,swish=-100,currentTime=0;const previousOffset=new T.Vector3();
  fire.current=()=>{if(shot&&!shot.finished)return;shotRoof=state.current.roof;shot=launchShot(state.current.power,state.current.aim,state.current.position);release=currentTime;setBusy(true);setShots(v=>v+1);setMessage('Ball in the air…')};
  return{update:(dt:number,time:number)=>{
   currentTime=time;const selected=state.current.roof,offset=offsets[selected];const lerped=previousOffset.clone().lerp(offset,runtime.reduced?1:1-Math.exp(-dt*3));const delta=lerped.clone().sub(previousOffset);camera.position.add(delta);controls.target.add(delta);previousOffset.copy(lerped);
   courts.forEach(({player,b,net},i)=>{player.group.visible=b.visible=i===selected;player.group.position.x=state.current.position;const age=time-release,throwPose=i===shotRoof&&age<1?Math.sin(Math.min(1,age)*Math.PI):0;player.left.rotation.x=player.right.rotation.x=-throwPose*2;player.group.position.y=throwPose*.12;net.rotation.z=time-swish<.6?Math.sin((time-swish)*20)*.035:0;if(!shot||shot.finished||i!==shotRoof)b.position.set(state.current.position,1.1+(runtime.reduced?0:Math.abs(Math.sin(time*3))*.3),4)});
   if(!shot||shot.finished)return;
   if(stepShot(shot,dt)){swish=time;setScore(v=>v+2);setCleared(v=>v.includes(shotRoof)?v:[...v,shotRoof]);setMessage(shotRoof===2?'All the way to the summit. Swish!':'Swish! The next rooftop is unlocked.');}
   const b=courts[shotRoof].b;b.position.set(shot.x,shot.y,shot.z);b.rotation.x+=dt*4;
   if(shot.finished){setBusy(false);if(!shot.scored)setMessage('Adjust your aim or power and try again.');}
  }};
 },[]);
 return <div className="play-game"><Stage build={build} label="Three connected rooftop basketball courts with a shooting character and ball physics" camera={[8,7,12]}/><div className="score-bubbles"><strong>{score} points</strong><span>{shots} shots</span><span>{rooftops[roof]}</span></div><div className="game-toolbar">{rooftops.map((name,i)=><button key={name} aria-pressed={roof===i} disabled={busy||(i>0&&!cleared.includes(i-1))} onClick={()=>{setRoof(i);setPosition(i===1?-.5:0);setAim(i===1?3:0);setMessage(name+'. Your next shot.')}}>{i+1}. {name}</button>)}</div><div className="game-toolbar"><button disabled={busy||position<=-3} onClick={()=>setPosition(p=>p-.5)}>Step left</button><button disabled={busy||position>=3} onClick={()=>setPosition(p=>p+.5)}>Step right</button><label>Aim {aim}°<input aria-label="Shot aim" type="range" min="-25" max="25" value={aim} onChange={e=>setAim(+e.target.value)}/></label><label>Power {power}%<input aria-label="Shot power" type="range" min="30" max="100" value={power} onChange={e=>setPower(+e.target.value)}/></label><button disabled={busy} onClick={()=>fire.current()}>Shoot basketball</button><button disabled={busy} onClick={()=>{setScore(0);setShots(0);setAim(0);setPower(65);setPosition(0);setRoof(0);setCleared([]);setMessage('Fresh rooftop journey. Take your shot.')}}>Reset journey</button></div><output aria-live="polite">{message}</output></div>;
}
