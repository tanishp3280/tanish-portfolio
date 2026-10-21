import * as T from 'three';
import {box,ball,cylinder,ring,sign,tree,person,textTexture} from './models';
export type LifeActivity='drums'|'chess'|'basketball'|'math'|'driving';
export const LIFE_LABELS:Record<LifeActivity,string>={drums:'A rhythm of my own',chess:'One move, many possibilities',basketball:'A little court time',math:'The curiosity classroom',driving:'The scenic route'};
export function createLifeScene(activity:LifeActivity){
 const group=new T.Group(),obstacles:T.Box3[]=[],interactive:T.Object3D[]=[];const ink=0x294763,blue=0x719bc8,ice=0xe9f2f5,white=0xfffaf0,green=0x9abfa7,pink=0xe9b4ac;let action=0,actionTime=-100;
 const block=(x:number,z:number,w:number,d:number)=>obstacles.push(new T.Box3(new T.Vector3(x-w/2-.3,-1,z-d/2-.3),new T.Vector3(x+w/2+.3,4,z+d/2+.3)));
 box(group,0,-.12,0,19,.22,19,activity==='basketball'?0xc4d8cf:0xdde9e4,.1);
 for(let i=0;i<15;i++){const t=tree(group,Math.sin(i*2.4)*8,Math.cos(i*2.4)*8,1.3+(i%3)*.15);t.traverse(o=>{if(o instanceof T.Mesh&&o.geometry.type==='SphereGeometry')(o.material as T.MeshToonMaterial).color.set(i%3?green:0xb2c8b3)})}
 const clouds=Array.from({length:7},(_,i)=>{const c=new T.Group();ball(c,0,0,0,.7,white,1.6,.6,1);ball(c,.7,.15,0,.5,white);c.position.set(i*3-9,5.5+(i%2),-7);group.add(c);return c});
 const friend=person(group,0,-1.8,1.15);friend.group.rotation.y=0;ball(friend.group,-.11,1.45,.23,.055,ink);ball(friend.group,.11,1.45,.23,.055,ink);const animations:((t:number,dt:number)=>void)[]=[];
 const mark=(object:T.Object3D)=>{object.traverse(o=>{if(o instanceof T.Mesh)interactive.push(o)});return object};
 let start=new T.Vector3(0,1.65,2.8),yaw=0,pitch=-.08;
 if(activity==='drums'){
  box(group,0,.04,-1.5,5,.12,3.4,blue,.15);sign(group,'TANISH / AFTER HOURS',0,2.7,-3.5,3.5,.6);box(group,0,1.7,-3.6,4.8,2.8,.12,ice);
  friend.group.position.z=-2;friend.left.rotation.x=-1;friend.right.rotation.x=-1;
  const drums=[[-.7,.65,-.9,.42],[.7,.65,-.9,.42],[0,.45,-.3,.62]];drums.forEach(([x,y,z,r])=>{const d=cylinder(group,x,y,z,r,.5,blue);mark(d);cylinder(group,x,y+.26,z,r+.02,.03,white);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;cylinder(group,x+Math.cos(a)*r,y,z+Math.sin(a)*r,.022,.47,ink)}});
  for(const x of [-1.45,1.45]){cylinder(group,x,.75,-1.1,.035,1.5,ink);cylinder(group,x,1.52,-1.1,.55,.03,0xdac88e);block(x,-1.1,.5,.5)}
  const sticks=[box(group,-.4,1.38,-1.05,.03,.6,.03,white),box(group,.4,1.38,-1.05,.03,.6,.03,white)];block(0,-.9,2.3,2.0);animations.push(t=>{const intensity=t-actionTime<1?1.3:.35;friend.left.rotation.x=-1+Math.sin(t*8)*intensity*.2;friend.right.rotation.x=-1+Math.cos(t*8)*intensity*.2;sticks.forEach((s,i)=>s.rotation.x=.8+Math.sin(t*8+i*Math.PI)*intensity*.6)});
 }else if(activity==='chess'){start.set(0,1.65,2.1);pitch=-.2;
  box(group,0,.9,-.8,2.3,.15,2.3,blue,.12);for(const x of [-.85,.85])for(const z of [-1.65,.05])box(group,x,.45,z,.1,.9,.1,ink);block(0,-.8,2.3,2.3);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)box(group,(c-3.5)*.25,.99,-.8+(r-3.5)*.25,.25,.02,.25,(r+c)%2?ink:white,0);
  const pieces:T.Group[]=[];for(let row=0;row<4;row++)for(let col=0;col<8;col++){const p=new T.Group(),dark=row>1,color=dark?blue:white;const z=row===0?-1.675:row===1?-1.425:row===2?-.175:.075;p.position.set((col-3.5)*.25,1.03,z);cylinder(p,0,.035,0,.085,.07,color);cylinder(p,0,.12,0,.045,.14,color);ball(p,0,.22,0,.055,color);if(row===0||row===3){if(col===3||col===4){box(p,0,.3,0,.035,.13,.035,color);box(p,0,.32,0,.11,.035,.035,color)}else cylinder(p,0,.25,0,.065,.065,color)}group.add(p);mark(p);pieces.push(p)}
  sign(group,'A GOOD MOVE STARTS WITH A QUESTION',0,2.6,-3.6,4,.4);friend.group.position.z=-2.7;animations.push(t=>{pieces[12].position.z=-1.425+Math.min(1,Math.max(0,(t-actionTime)*.8))*(action%2?.5:0);friend.group.rotation.y=Math.sin(t*.4)*.08});
 }else if(activity==='basketball'){start.set(0,1.65,4.2);
  friend.group.position.set(-1.5,0,-1.7);box(group,0,.015,0,10,.035,12,0xb0c7b9,.1);for(const x of [-4.7,4.7])box(group,x,.045,0,.045,.02,11.4,white,0);for(const z of [-5.7,5.7])box(group,0,.045,z,9.4,.02,.045,white,0);const center=ring(group,1.5,.025,white);center.rotation.x=Math.PI/2;center.position.y=.05;box(group,0,.05,0,9.4,.02,.045,white,0);
  box(group,0,1.8,-5.5,.13,3.6,.13,ink);box(group,0,3.35,-5.4,2.1,1.25,.13,white);box(group,0,3.2,-5.31,.85,.55,.025,blue);const hoop=ring(group,.48,.04,pink);hoop.rotation.x=Math.PI/2;hoop.position.set(0,2.85,-4.8);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;box(group,Math.cos(a)*.4,2.57,-4.8+Math.sin(a)*.4,.018,.55,.018,white)}
  const basketball=ball(group,-1,.3,-1,.3,0xdcb18a);const seams=[ring(group,.302,.009,ink),ring(group,.302,.009,ink)];seams[1].rotation.y=Math.PI/2;mark(basketball);block(0,-5.5,.3,.3);animations.push(t=>{const a=t-actionTime;if(a>=0&&a<2.2){const u=Math.min(1,a/1.5);basketball.position.set(-1+u,1+5*u-3.15*u*u-Math.max(0,a-1.5)*3,-1-u*3.8)}else basketball.position.set(-1,.32+Math.abs(Math.sin(t*4))*.8,-1);seams.forEach(s=>s.position.copy(basketball.position));friend.right.rotation.x=-.5+Math.sin(t*4)*.35});
 }else if(activity==='math'){
  box(group,0,1.8,-3.5,5.5,3.2,.2,blue,.1);box(group,0,1.8,-3.36,5.2,2.9,.08,0x315d67);const formulas=['Curiosity + practice = possibility','f(x) = x²     f\'(x) = 2x','1 + 2 + … + n = n(n + 1) / 2','E[X] = Σ x · P(X = x)'];formulas.forEach((text,i)=>sign(group,text,0,2.7-i*.55,-3.3,4.6,.35));friend.group.position.set(2.1,0,-2.4);friend.left.rotation.z=-1.1;const chalk=box(group,1.65,1.1,-2.4,.035,.2,.035,white);mark(chalk);const answer=sign(group,'WHAT DO YOU NOTICE?',0,.7,-3.29,3.8,.32);block(0,-3.5,5.5,.3);for(let i=0;i<3;i++){box(group,-2+i*2,.7,.5,1.35,.12,.9,white);for(const x of [-.5,.5])box(group,-2+i*2+x,.35,.5,.06,.7,.06,blue);block(-2+i*2,.5,1.35,.9)}start.set(0,1.65,3.5);let shown=-1;animations.push(t=>{friend.left.rotation.z=-1.1+Math.sin(t*2)*.1;chalk.position.y=1.2+Math.sin(t*2)*.15;if(shown!==action){shown=action;const x=action%5+1,mat=answer.material as T.MeshBasicMaterial;mat.map?.dispose();mat.map=textTexture(`x = ${x}     f(x) = ${x*x}     slope = ${2*x}`);mat.needsUpdate=true;}});
 }else{
  friend.group.visible=false;box(group,0,.01,0,4.5,.04,19,0x6e8290);for(let i=0;i<12;i++)box(group,0,.05,-8+i*1.5,.08,.02,.65,white,0);for(let i=0;i<8;i++){const house=new T.Group();house.position.set((i%2?1:-1)*5,0,-7+Math.floor(i/2)*4);box(house,0,1.05,0,2.4,2.1,2.1,i%2?ice:0xe7d6c1);box(house,0,2.16,0,2.7,.18,2.4,blue);for(const x of [-.65,.65])box(house,x,1.25,1.06,.5,.65,.025,0x89bbd0);box(house,0,.48,1.08,.5,.9,.04,ink);group.add(house)}start.set(-1,1.2,5);pitch=-.02;
 }
 animations.push(t=>clouds.forEach((c,i)=>c.position.x=i*3-9+Math.sin(t*.08+i)*.3));
 return {group,obstacles,interactive,start,yaw,pitch,act:(time:number)=>{action++;actionTime=time;return action},update:(time:number,dt:number)=>{animations.forEach(fn=>fn(time,dt))}};
}
