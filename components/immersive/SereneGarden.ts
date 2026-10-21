import * as T from 'three';
import {box,ball,cylinder,ring} from '../sky/models';
/** A small riverside reading pavilion, with no machinery or construction sequence. */
export function buildSereneGarden(root:T.Group){
 const g=new T.Group();root.add(g);
 const wood=0x65717e,roof=0x586d7c,stone=0xc8d6d9,pink=0xe7b6c9;
 const preserve=(object:T.Object3D)=>object.traverse(o=>{if(o instanceof T.Mesh)(o.material as T.Material).userData.sakura=true});
 cylinder(g,0,-.38,0,4.4,.45,stone,4.6);
 const water=cylinder(g,0,-.12,0,4.22,.06,0xaac5ce);preserve(water);
 const terrace=box(g,1.15,.04,-.9,3.1,.3,2.5,stone,.05);
 box(g,1.15,.23,-.9,2.85,.1,2.25,wood);
 for(const x of [-.05,2.35])for(const z of [-1.85,.05]){box(g,x,1.22,z,.13,2,.13,wood);box(g,x,2.16,-.9,.16,.13,2.35,wood);}
 for(const z of [-1.85,.05])box(g,1.15,2.16,z,2.9,.16,.14,wood);
 // Curved tiled eaves: a custom ridge cross-section rather than a box roof.
 const vertices:number[]=[],indices:number[]=[];const steps=16;
 for(let i=0;i<=steps;i++){const x=-1.85+i/steps*3.7,y=2.25+.85*(1-Math.abs(x)/1.85)**1.7+.18*(Math.abs(x)/1.85)**8;vertices.push(1.15+x,y,-2.4,1.15+x,y,.6);if(i<steps){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2)}}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();const canopy=new T.Mesh(geo,new T.MeshToonMaterial({color:roof,side:T.DoubleSide}));g.add(canopy);
 for(let i=0;i<13;i++){const z=-2.4+i*.25;const points=[];for(let j=0;j<=steps;j++){const x=-1.85+j/steps*3.7;points.push(new T.Vector3(1.15+x,2.27+.85*(1-Math.abs(x)/1.85)**1.7+.18*(Math.abs(x)/1.85)**8,z));}g.add(new T.Line(new T.BufferGeometry().setFromPoints(points),new T.LineBasicMaterial({color:0x899ba5})));}
 box(g,1.1,.57,-1,1.1,.12,.65,wood);for(const x of [.7,1.5])box(g,x,.38,-1,.08,.35,.4,wood);box(g,1.1,.65,-1,.5,.04,.37,0xf2f1e7);box(g,1.1,.68,-1,.025,.015,.38,0xb1a3a9);
 // Short arched footbridge over the foreground water.
 for(let i=0;i<15;i++){const x=-2.9+i*.25,y=.08+Math.sin(i/14*Math.PI)*.42;box(g,x,y,1.5,.26,.1,.95,wood);for(const z of [1,2]){if(i%2===0)box(g,x,y+.34,z,.045,.65,.045,wood);const rail=box(g,x,y+.67,z,.3,.055,.055,wood);rail.rotation.z=Math.cos(i/14*Math.PI)*.32;}}
 const blossoms:T.Group[]=[];
 for(const [x,z,s]of [[-2.5,-1.2,1],[2.8,1.3,.72]] as const){const tree=new T.Group();tree.position.set(x,0,z);tree.scale.setScalar(s);g.add(tree);box(tree,0,1.15,0,.2,2.3,.22,0x68617a);for(let j=0;j<3;j++){const branch=box(tree,(j-1)*.35,1.9+j*.15,0,.12,1.3,.12,0x68617a);branch.rotation.z=(j-1)*-.65;}const crown=new T.Group();tree.add(crown);blossoms.push(crown);for(let j=0;j<11;j++){ball(crown,Math.sin(j*2.4)*.95,2.6+Math.cos(j*1.7)*.4,Math.cos(j*2.4)*.7,.48,j%3===0?0xf0d2df:pink,1.25,.65,1);}}
 for(const x of [-3.2,3.2]){cylinder(g,x,.18,.1,.28,.35,stone);box(g,x,.55,.1,.12,.55,.12,wood);box(g,x,.9,.1,.38,.4,.38,0xf0e2cb);box(g,x,1.15,.1,.55,.1,.55,roof);}
 const fish=Array.from({length:5},(_,i)=>{const f=new T.Group();g.add(f);ball(f,0,0,0,.11,i%2?0xdeaaa0:0xe8e7db,2,.3,.65);const tail=box(f,-.23,0,0,.12,.025,.15,0xc79391);return {f,tail}});
 const ripples=Array.from({length:5},(_,i)=>{const r=ring(g,.3+i*.1,.009,0xdce9ea);r.rotation.x=-Math.PI/2;r.position.set(-1.4+i*.6,-.075,.1);return r});
 preserve(g);terrace.userData.href='/research';canopy.userData.href='/research';
 return {pavilion:canopy,update:(t:number)=>{blossoms.forEach((b,i)=>b.rotation.z=Math.sin(t*.42+i)*.025);fish.forEach(({f,tail},i)=>{const a=t*.12+i*1.256;f.position.set(Math.cos(a)*2.8,-.065,Math.sin(a)*2.5);f.rotation.y=-a-Math.PI/2;tail.rotation.y=Math.sin(t*2+i)*.25});ripples.forEach((r,i)=>{const p=(t*.15+i*.2)%1;r.scale.setScalar(.4+p*1.7);r.visible=p<.85;});}};
}
