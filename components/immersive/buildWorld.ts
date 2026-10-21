import * as T from 'three';
import {addCityLife} from './CityLife';
import {addSakuraRiver} from './SakuraRiver';
import {ball,box,cylinder,ring,tree,person,createModel,createCity,sign,type Model} from '../sky/models';
import {buildSereneGarden} from './SereneGarden';
import {worlds,type WorldPage} from '@/lib/immersive';
export type Hotspot={object:T.Object3D;label:string;chapter?:number;action?:string;offset?:number};
export type Shot={eye:[number,number,number];look:[number,number,number]};
export type BuiltWorld={shots:Shot[];hotspots:Hotspot[];update:(t:number,dt:number,p:number,chapter:number,selection:number)=>void};
const C={paper:0xf2f4f3,blue:0x829aa7,ink:0x3e4e60,ice:0xd8e1e4,water:0x9eb9c3};
function writing(parent:T.Object3D,title:string,body:string,x:number,y:number,z:number,w:number,h:number,flat=false){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const c=canvas.getContext('2d')!;
 c.fillStyle='#f1f1df';c.fillRect(0,0,1024,768);c.fillStyle='#303c3c';c.textBaseline='top';
 const wrap=(text:string,size:number,start:number)=>{c.font=`600 ${size}px Fredoka, sans-serif`;let line='',yy=start;for(const word of text.split(' ')){const next=line+word+' ';if(c.measureText(next).width>860){c.fillText(line,82,yy);yy+=size*1.3;line=word+' '}else line=next;}c.fillText(line,82,yy);return yy+size*1.5};
 const end=wrap(title,64,65);c.strokeStyle='#84a7b4';c.lineWidth=4;c.beginPath();c.moveTo(82,end);c.lineTo(920,end);c.stroke();wrap(body,43,end+38);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
 const plane=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,side:T.DoubleSide}));plane.position.set(x,y,z);if(flat)plane.rotation.x=-Math.PI/2;parent.add(plane);return plane;
}
const shot=(eye:Shot['eye'],look:Shot['look']=[0,1,0]):Shot=>({eye,look});
export function buildWorld(scene:T.Scene,page:WorldPage):BuiltWorld{
 const root=new T.Group();scene.add(root);const hotspots:Hotspot[]=[];const updates:BuiltWorld['update'][]=[];let shots:Shot[]=[];
 const add=(kind:Parameters<typeof createModel>[0],x=0,y=0,z=0,scale=1)=>{const m=createModel(kind);m.group.position.set(x,y,z);m.group.scale.setScalar(scale);root.add(m.group);updates.push((t,dt,p,ch,sel)=>m.update(t,dt,{step:sel,value:p*25,variant:kind==='desk'?ch%3:kind==='train'?ch:kind==='garden'?Math.max(ch*2,sel%9):ch,playing:true,reduced:false}));return m;};
 const target=(object:T.Object3D,label:string,chapter?:number,action?:string,offset=.6)=>{const hs={object,label,chapter,action,offset};hotspots.push(hs);object.userData.hotspot=hotspots.length-1;return hs};
 if(page==='home'){
  const garden=buildSereneGarden(root);updates.push(t=>garden.update(t));target(garden.pavilion,'Explore my research',undefined,'route:/research');
  shots=[shot([8,6,10],[0,1,0]),shot([6,4.5,8],[0,.8,0]),shot([4.5,3.2,6],[.6,1,-.5])];
 }else if(page==='research'){
  const book=new T.Group();root.add(book);box(book,0,-.15,0,8.5,.2,5.4,C.blue,.15);box(book,0,0,0,8.2,.18,5.1,C.paper);
  writing(book,'Research notebook','Tanish Patil / questions, experiments, evidence.',-2.05,.11,0,3.9,4.9,true);
  const leaves:T.Group[]=[];
  for(let i=3;i>=0;i--){const hinge=new T.Group();hinge.position.y=.13+(3-i)*.04;const ch=worlds.research.chapters[i];writing(hinge,ch.title,ch.detail,2.03,.02,0,4,5,true);box(hinge,2.03,0,0,4,.018,5,C.paper,.01);book.add(hinge);leaves[i]=hinge;target(hinge.children[0],'Turn notebook page '+(i+1),Math.min(i+1,4),undefined,.1)}
  for(let i=0;i<12;i++){const spiral=ring(book,.1,.028,C.ink);spiral.position.set(0,.1,-2.3+i*.42);spiral.rotation.y=Math.PI/2}
  const brain=new T.Group();brain.position.set(-2,.2,0);book.add(brain);for(let i=0;i<14;i++){ball(brain,Math.sin(i*2.4)*.75,.4+Math.cos(i)*.3,Math.cos(i*2.4)*.5,.26,i%2?C.blue:C.ice)}
  const bars=new T.Group();bars.position.set(2,.2,0);book.add(bars);for(let i=0;i<6;i++)box(bars,(i-2.5)*.35,(.4+i*.14)/2,0,.22,.4+i*.14,.3,C.blue);
  const observatory={group:new T.Group()};observatory.group.position.set(0,0,-11);root.add(observatory.group);const readingGarden=buildSereneGarden(observatory.group);updates.push(t=>readingGarden.update(t));target(readingGarden.pavilion,'Enter the research pavilion',3,undefined,.3);
  // A separate interior sits behind the telescope, allowing the camera to travel through the lens.
  const room=new T.Group();room.position.set(0,0,-23);root.add(room);cylinder(room,0,-.2,0,5,.3,C.ice);for(const x of [-4.5,4.5]){box(room,x,2,-1,.18,4,5,C.ink);for(let k=0;k<6;k++)box(room,x,1.8,-3+k*.8,.2,3.4,.045,C.paper);}box(room,0,4,-1,9.5,.22,6,C.ink);
  const desk=add('desk',0,0,-24,1.4);writing(room,'Keep the questions open.','ThinkNeuro / brain data in R\nQuant Research Systems / reproducible models',0,2,-3.5,5,3);
  for(let i=0;i<22;i++)ball(room,Math.sin(i*2.4)*4,2+Math.cos(i)*1.4,Math.cos(i*2.4)*4,.045,C.blue);
  updates.push((t,dt,p,ch)=>{leaves.forEach((leaf,i)=>{const turn=T.MathUtils.clamp((p*4-i)*1.7,0,1);leaf.rotation.z=turn*Math.PI*.96});brain.scale.setScalar(.1+Math.sin(Math.PI*Math.min(1,p*3))*.9);brain.rotation.y=t*.25;bars.scale.y=.15+T.MathUtils.clamp(p*3-1,0,1)*1.2;observatory.group.rotation.y=0;observatory.group.visible=p>.42;room.visible=p>.76;desk.group.visible=p>.76;book.visible=p<.43});
  shots=[shot([1,9,8],[0,0,0]),shot([-1,7,5],[0,0,0]),shot([4,5,3],[1,0,0]),shot([0,3.25,-6.5],[0,3.25,-12]),shot([-3,2.5,-19.5],[0,1.4,-24])];
 }else if(page==='skills'){
  box(root,0,.25,0,10,.55,4.8,C.ink,.3);const keys:T.Mesh[]=[];const labels=['J','P','R','A','M','L'];
  const texts=['JavaScript / Building U','Python / 19 quant apps','R / ThinkNeuro','Arduino / animatronics','Math / 25+ students','Leadership / STEMPulse'];
  for(let row=0;row<4;row++)for(let col=0;col<10;col++){const key=box(root,-4.2+col*.93,.72,-1.65+row*1.04,.79,.32,.85,row===1?C.blue:C.paper,.12);keys.push(key);if(row===1&&col<6){const label=sign(root,labels[col],key.position.x,.91,key.position.z,.48,.45);label.rotation.x=-Math.PI/2;target(key,texts[col],undefined,'key:'+col,.3)}}
  const backdrop=new T.Group();backdrop.position.z=-8;root.add(backdrop);const garden=buildSereneGarden(backdrop);
  const screen=writing(root,'Every key has a story.','Select J, P, R, A, M or L to explore a skill.',-7,3,0,6,3);
  let last=-1;updates.push((t,dt,p,ch,sel)=>{garden.update(t);keys.forEach((k,i)=>k.position.y=.72+Math.sin(t*2+i*.25)*.025-(i===10+sel%6?.2:0));if(last!==sel){last=sel;const old=screen.material as T.MeshBasicMaterial;old.map?.dispose();const newText=writing(new T.Group(),texts[sel%6],['Collaborative development through the Building U coding internship.','Portfolio construction, risk, derivatives and market research.','Brain-wave patterns, datasets, figures, a poster and a report.','Sensors, motors and pneumatics: 3rd in NC, top ten globally.','Founded a MathCounts chapter and won Math Olympiad three times.','Grew a STEM community from 7 to 20+ members.'][sel%6],0,0,0,6,3);old.map=(newText.material as T.MeshBasicMaterial).map;old.needsUpdate=true;newText.geometry.dispose();(newText.material as T.Material).dispose()}});
  shots=[shot([5,8,10],[0,0,0]),shot([4,4,-2],[0,1,-8]),shot([-7,3.5,9],[-7,3,0])];
 }else if(page==='experience'){
  // A straight railway gives the scroll journey actual distance and distinct stops.
  box(root,0,-.3,-16,14,.45,46,C.ice,.3);for(const x of [-.65,.65])box(root,x,0,-16,.09,.1,44,C.ink);
  for(let i=0;i<65;i++)box(root,0,-.02,5-i*.66,1.7,.1,.18,C.blue);
  const engine=new T.Group();root.add(engine);box(engine,0,.65,0,1.6,1,2.8,C.blue,.2);box(engine,0,1.5,.7,1.5,1.2,1.3,C.paper,.15);box(engine,0,2.15,.7,1.9,.15,1.7,C.ink);cylinder(engine,0,1.3,-.8,.25,.8,C.ink);for(const x of [-.8,.8])for(const z of [-.8,.8]){const w=cylinder(engine,x,.3,z,.32,.15,C.ink);w.rotation.z=Math.PI/2}
  worlds.experience.chapters.forEach((ch,i)=>{const station=new T.Group();station.position.set(i%2?3.6:-3.6,0,2-i*8);root.add(station);box(station,0,.2,0,3.3,.4,3.5,C.paper);for(const x of [-1.4,1.4])box(station,x,1.4,0,.1,2.5,.1,C.ink);box(station,0,2.8,0,3.8,.2,3,C.blue);writing(station,ch.title,ch.detail,0,1.6,1.5,3,1.7);target(station,ch.title,i,undefined,3);tree(root,-5.5,2-i*8,1.5);person(root,2.5,3-i*8,.8)});
  updates.push((t,dt,p)=>{engine.position.z=2-p*32;engine.position.y=Math.sin(t*8)*.025});shots=worlds.experience.chapters.map((_,i)=>shot([5,4,8-i*8],[0,1,2-i*8]));
 }else if(page==='work'){
  const workstation=add('desk',0,0,0,2);updates.push((t,dt,p)=>{workstation.group.visible=p<.32;workstation.group.scale.setScalar(2*(1-T.MathUtils.smoothstep(p,.08,.32)))});const satellites:T.Group[]=[];
  worlds.work.chapters.slice(1).forEach((ch,i)=>{const sat=new T.Group();sat.position.set((i-1)*5,3,-5-i);root.add(sat);box(sat,0,0,0,3.7,2.5,.22,C.ink,.2);writing(sat,ch.title,ch.detail,0,0,.13,3.4,2.2);target(sat,ch.title,i+1,undefined,1.6);
   const diagram=new T.Group();diagram.position.set(0,-.7,.35);sat.add(diagram);
   if(i===0){for(let j=0;j<8;j++)box(diagram,(j-3.5)*.28,.12+j*.025,0,.16,.22+j*.05,.22,j%2?C.blue:C.ice)}
   else if(i===1){const nodes=Array.from({length:7},(_,j)=>ball(diagram,Math.cos(j)*1.05,Math.sin(j)*.2,.2+Math.sin(j)*.1,.095,C.blue));for(let j=1;j<nodes.length;j++){const a=nodes[j-1].position,b=nodes[j].position;const line=new T.Mesh(new T.CylinderGeometry(.015,.015,a.distanceTo(b),6),new T.MeshToonMaterial({color:C.ink}));line.position.copy(a).add(b).multiplyScalar(.5);line.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());diagram.add(line)}}
   else{box(diagram,0,.18,0,1,.5,.6,C.blue);const roof=new T.Mesh(new T.ConeGeometry(.8,.4,4),new T.MeshToonMaterial({color:C.ice}));roof.rotation.y=Math.PI/4;roof.position.y=.63;diagram.add(roof);box(diagram,0,.1,.32,.18,.3,.03,C.paper)}
   updates.push(t=>{diagram.rotation.y=Math.sin(t*.5+i)*.2;diagram.position.y=-.7+Math.sin(t+i)*.03});satellites.push(sat)});
  updates.push((t,dt,p,ch,sel)=>satellites.forEach((s,i)=>{s.rotation.y=Math.sin(t*.3+i)*.08;s.position.y=3+Math.sin(t+i)*.15;s.scale.setScalar(ch===i+1?1.15:.85)}));
  shots=[shot([8,7,11],[0,1,0]),shot([-5,3.5,1],[-5,3,-5]),shot([0,3.7,-.5],[0,3,-6]),shot([5,3.5,-1],[5,3,-7])];
 }else if(page==='resume'){
  const pages:T.Group[]=[];worlds.resume.chapters.forEach((ch,i)=>{const paper=new T.Group();paper.position.set(0,-i*4.6,0);root.add(paper);box(paper,0,0,-.03,6.4,4.4,.06,C.paper,.08);writing(paper,ch.title,ch.detail,0,0,.015,6.3,4.3);const seal=cylinder(paper,2.45,-1.3,.08,.4,.08,C.blue);seal.rotation.x=Math.PI/2;target(seal,'Stamp '+ch.title,i,'stamp',0);pages.push(paper)});
  updates.push((t,dt,p,ch,sel)=>pages.forEach((paper,i)=>{paper.rotation.x=Math.max(0,i-p*3)*.18;paper.rotation.y=Math.sin(t*.3+i)*.025+(sel%2&&i===ch?.06:0)}));shots=worlds.resume.chapters.map((_,i)=>shot([1,-i*4.6+.6,8],[0,-i*4.6,0]));
 }else if(page==='contact'){
  const mail=add('mail',0,0,0,2.5);target(mail.targets[0],'Open a letter to Tanish',undefined,'mail',.7);
  const plane=new T.Group();root.add(plane);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([0,0,-1.5,-1,0,1,0,.2,.4,0,0,-1.5,0,.2,.4,1,0,1],3));geo.computeVertexNormals();plane.add(new T.Mesh(geo,new T.MeshToonMaterial({color:C.paper,side:T.DoubleSide})));target(plane,'Send a hello',undefined,'mail',.4);
  for(let i=0;i<12;i++){const cloud=new T.Group();cloud.position.set(Math.sin(i*2)*7,1+Math.cos(i),-3-i*2);root.add(cloud);ball(cloud,0,0,0,1,C.paper,1.5,.6,1);ball(cloud,.8,.2,0,.7,C.paper)}
  updates.push((t,dt,p)=>{plane.position.set(Math.sin(p*Math.PI*2)*3,2+p*2,-2-p*17);plane.rotation.z=Math.cos(p*Math.PI*2)*.3;plane.position.y+=Math.sin(t)*.1});shots=[shot([6,5,10],[0,2,0]),shot([5,5,-3],[0,3,-9]),shot([0,5,-12],[0,4,-20])];
 }else if(page==='studio'){
  const garden=add('garden',0,0,0,3);for(let i=0;i<4;i++){const a=i*Math.PI/2;const seed=ball(root,Math.cos(a)*4,.5,Math.sin(a)*4,.35,C.blue);target(seed,['Grow STEMPulse','Grow a project','Grow a lesson','Grow a question'][i],i,'seed',.5)}
  const sprouts=Array.from({length:10},(_,i)=>tree(root,Math.sin(i*2.4)*4,Math.cos(i*2.4)*4,.2));updates.push((t,dt,p,ch,sel)=>sprouts.forEach((s,i)=>{s.scale.setScalar(.2+Math.min(1,Math.max(0,p*2-i*.08)+sel*.04));s.rotation.z=Math.sin(t+i)*.035}));shots=[shot([8,7,10],[0,1,0]),shot([6,6,7],[0,1,0]),shot([-6,4,6],[0,1,0]),shot([0,4.5,8],[0,1,0])];
 }else if(page==='map'){
  const cityLife=addCityLife(root);updates.push(t=>cityLife(t));
  const river=addSakuraRiver(root);updates.push(t=>river(t));
  const city=createCity();root.add(city.group);updates.push((t,dt,p,ch,sel)=>city.update(t,dt,{step:sel,value:0,variant:0,playing:true}));
  // In-world dispatch board: a low-resolution LED canvas uploaded at 10 Hz.
  const led=document.createElement('canvas');led.width=384;led.height=96;const ctx=led.getContext('2d')!;
  const ledTexture=new T.CanvasTexture(led);ledTexture.colorSpace=T.SRGBColorSpace;ledTexture.magFilter=T.NearestFilter;
  const kiosk=new T.Group();kiosk.position.set(0,0,5);root.add(kiosk);
  for(const x of [-3,3])box(kiosk,x,1.7,0,.18,3.4,.18,C.ink);
  box(kiosk,0,3.6,0,7.7,2.15,.3,C.ink,.1);
  const screen=new T.Mesh(new T.PlaneGeometry(7.35,1.84),new T.MeshBasicMaterial({map:ledTexture}));screen.position.set(0,3.6,.16);kiosk.add(screen);
  target(screen,'District dispatch: explore my achievements',undefined,'route:/awards');
  let ledTick=-1;updates.push(t=>{const tick=Math.floor(t*10);if(tick===ledTick)return;ledTick=tick;ctx.fillStyle='#3c4c5f';ctx.fillRect(0,0,384,96);ctx.fillStyle='#e4edf0';ctx.font='bold 18px monospace';ctx.fillText('TANISH / DISTRICT DISPATCH',12,26);ctx.font='bold 22px monospace';const text='19 QUANT APPS   3X OLYMPIAD   25+ STUDENTS   ';const width=ctx.measureText(text).width;const x=-(tick*2%width);ctx.fillText(text,x,65);ctx.fillText(text,x+width,65);ctx.fillStyle='#17131d88';for(let i=0;i<384;i+=4)ctx.fillRect(i,0,1,96);for(let j=0;j<96;j+=4)ctx.fillRect(0,j,384,1);ledTexture.needsUpdate=true;});
  // 50 x 30 ground versus the original 20 x 15: five times the surface area.
  box(root,0,-.75,0,50,.5,30,C.ice,.5);for(const z of [-10,10])box(root,0,-.46,z,49,.03,2,C.paper);for(const x of [-15,15])box(root,x,-.44,0,2,.04,29,C.paper);
  const destinations=['/skills','/research','/work','/experience','/resume','/contact','/studio'];
  for(let i=0;i<24;i++){const x=i<12?-22+(i%6)*8:-22+(i%6)*8;const z=i<6?-13:i<12?13:i<18?-8:8;const h=2+(i%6)*1.8+(i%5===0?5:0);const b=new T.Group();b.position.set(x,-.45,z);root.add(b);box(b,0,h/2,0,2.8,h,2.5,i%2?C.paper:C.blue,.12);box(b,0,h+.12,0,3.1,.24,2.8,C.ink);if(i%3===0){box(b,0,h+1,0,1.8,1.8,1.7,C.blue);cylinder(b,0,h+2.8,0,.05,2,C.ink);}else if(i%3===1){for(let f=1;f<h;f+=1.8)box(b,0,f,1.4,3.25,.12,.5,C.paper);}else{box(b,0,.9,1.7,3.2,.16,.9,0xd9adbe);sign(b,['BOOKS','TEA','STUDIO','RAMEN'][i%4],0,1.6,1.29,2.3,.45);}for(let r=0;r<Math.floor(h);r++)for(let col=0;col<3;col++)box(b,(col-1)*.8,.65+r,1.27,.42,.45,.04,C.ice,.02);target(b,['Workshop annex','Research hall','Project studio','Journey station','Library wing','Post office','Community house'][i%7],undefined,'route:'+destinations[i%7],h+.5);if(i%3===0)tree(root,x+2,z,1.3)}
  city.targets.forEach(o=>{if(o.userData.href&&!hotspots.some(h=>h.action==='route:'+o.userData.href))target(o,o.userData.label,undefined,'route:'+o.userData.href,2)});
  for(let i=0;i<3;i++){const classroom=new T.Group();classroom.position.set(16-i*5,0,2+i);root.add(classroom);box(classroom,0,.7,0,3,.2,1.5,C.paper);for(let j=0;j<3;j++)person(classroom,-1+j,1,.8);const board=writing(classroom,['MathCounts','FLL robotics','STEMPulse'][i],['25+ students in a chapter I founded.','35 young robot builders supported.','A community grown from 7 to 20+ members.'][i],0,2,-1.5,3,1.8);target(board,['MathCounts teaching','FLL mentoring','STEMPulse leadership'][i],undefined,'route:/experience',1);}
  shots=[shot([34,29,38],[0,0,0]),shot([-21,8,8],[-15,1,-3]),shot([4,7,-1],[-2,2,-5]),shot([25,15,10],[15,1,1]),shot([-8,6,17],[-3,1,8])];
 }
 return {shots,hotspots,update:(t,dt,p,ch,sel)=>updates.forEach(fn=>fn(t,dt,p,ch,sel))};
}
