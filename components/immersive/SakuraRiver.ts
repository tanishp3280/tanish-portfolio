import * as T from 'three';
import {box} from '../sky/models';
/** Low-cost geometry; all petals share one instanced draw call. */
export function addSakuraRiver(root:T.Group){
 const environment=new T.Group();root.add(environment);
 const slab=(x:number,y:number,z:number,w:number,h:number,d:number,color:number)=>{const m=box(environment,x,y,z,w,h,d,color);(m.material as T.Material).userData.sakura=true;return m};
 slab(0,-.62,20,62,.12,10,0x9bb6c0);
 slab(0,-.4,15.3,60,.5,.55,0x748997);slab(0,-.4,25,60,.5,.55,0x748997);
 slab(0,.35,20,5,.35,11,0xc9d7dc);
 for(const x of [-2.6,2.6]){slab(x,1.1,20,.12,.12,11,0x516775);for(let z=15;z<26;z+=1.3)slab(x,.8,z,.08,.6,.08,0x516775);}
 for(const z of [16.5,23.5])slab(0,-.2,z,4,1,.5,0x758994);
 const crowns:T.Group[]=[];
 for(let i=0;i<12;i++){const x=-26+i*4.7,z=i%2?14:26;slab(x,1.1,z,.28,3,.3,0x62617d);const crown=new T.Group();crown.position.set(x,3,z);environment.add(crown);crowns.push(crown);for(let j=0;j<7;j++){const mat=new T.MeshToonMaterial({color:j%3===0?0xf3d7e1:j%3===1?0xe9b6cc:0xd8a2bf});mat.userData.sakura=true;const blossom=new T.Mesh(new T.BoxGeometry(1.35,.65,1.15),mat);blossom.position.set(Math.sin(j*2.4)*1.1,Math.cos(j*1.3)*.55,Math.cos(j*2.4)*.85);crown.add(blossom);}}
 const material=new T.MeshBasicMaterial({color:0xe8b0c9,side:T.DoubleSide});material.userData.sakura=true;
 const petals=new T.InstancedMesh(new T.PlaneGeometry(.13,.09),material,64);petals.instanceMatrix.setUsage(T.DynamicDrawUsage);petals.frustumCulled=false;environment.add(petals);
 const dummy=new T.Object3D();const glints:T.Mesh[]=[];for(let i=0;i<26;i++)glints.push(slab(-28+i*2.2,-.54,16+(i%5)*1.6,.8+(i%4)*.5,.012,.08,0xdce8e9));
 return(t:number)=>{crowns.forEach((c,i)=>c.rotation.z=Math.sin(t*.45+i)*.025);for(let i=0;i<64;i++){dummy.position.set(((i*7.37+t*.4)%58)-29,4-((t*.22+i*.17)%4),15+((i*1.71+t*.16)%11));dummy.rotation.set(t*.3+i,t*.18,Math.sin(t*.4+i));dummy.updateMatrix();petals.setMatrixAt(i,dummy.matrix)}petals.instanceMatrix.needsUpdate=true;glints.forEach((g,i)=>{g.scale.x=.7+Math.sin(t*.6+i)*.3;g.position.x=-28+i*2.2+Math.sin(t*.25+i)*.3})};
}
