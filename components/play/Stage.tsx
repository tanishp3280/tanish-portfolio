'use client';
import {useEffect,useRef} from 'react';
import * as T from 'three';
import {depthRenderer} from '@/lib/cartoon';
import {inkSilhouettes} from '@/lib/toon-ink';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {onFrame,runtime} from '@/lib/spatial';
export type StageContext={camera:T.PerspectiveCamera;controls:OrbitControls};
export type StageBuild=(scene:T.Scene,context:StageContext)=>{update?:(dt:number,time:number)=>void;click?:(o:T.Object3D)=>void;dispose?:()=>void};
type StageModel=ReturnType<StageBuild>;
function disposeScene(scene:T.Scene){
 const geometries=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
 scene.traverse(object=>{if(object instanceof T.DirectionalLight||object instanceof T.SpotLight) object.shadow.dispose();if(object instanceof T.Mesh){geometries.add(object.geometry);(Array.isArray(object.material)?object.material:[object.material]).forEach(material=>{materials.add(material);const map=(material as T.MeshBasicMaterial).map;if(map)textures.add(map)})}});
 geometries.forEach(item=>item.dispose());materials.forEach(item=>item.dispose());textures.forEach(item=>item.dispose());scene.clear();
}
export default function Stage({build,label,camera=[6,7,9],target=[0,.5,0]}:{build:StageBuild;label:string;camera?:number[];target?:number[]}){
 const host=useRef<HTMLDivElement>(null),stage=useRef<{scene:T.Scene;context:StageContext;model:StageModel;time:number}|null>(null);
 const initialView=useRef({camera,target});
 // Keep one GPU context and camera for the lifetime of the dialog. Selecting a
 // chess square replaces the model, never the renderer or the visitor's orbit.
 useEffect(()=>{
  const el=host.current!;let renderer:T.WebGLRenderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true})}catch{el.textContent='3D is unavailable. Use the controls below.';return}
  depthRenderer(renderer);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;el.appendChild(renderer.domElement);
  const scene=new T.Scene();const view=new T.PerspectiveCamera(42,1,.1,100);view.position.fromArray(initialView.current.camera);
  const orbit=new OrbitControls(view,renderer.domElement);orbit.target.fromArray(initialView.current.target);orbit.enablePan=false;orbit.enableZoom=false;orbit.maxPolarAngle=Math.PI*.47;orbit.update();
  const current={scene,context:{camera:view,controls:orbit},model:{} as StageModel,time:0};stage.current=current;
  const resize=()=>{view.aspect=el.clientWidth/Math.max(el.clientHeight,1);view.zoom=Math.min(1,view.aspect/1.25);view.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};resize();
  const ro=new ResizeObserver(resize);ro.observe(el);let visible=true;const io=new IntersectionObserver(([entry])=>visible=entry.isIntersecting);io.observe(el);
  let down=[0,0];const pd=(event:PointerEvent)=>down=[event.clientX,event.clientY];
  const pu=(event:PointerEvent)=>{if(Math.hypot(event.clientX-down[0],event.clientY-down[1])>5)return;const rect=el.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((event.clientX-rect.left)/rect.width*2-1,1-(event.clientY-rect.top)/rect.height*2),view);const hit=ray.intersectObjects(scene.children,true).find(hit=>hit.object.userData.pick!==undefined);if(hit)current.model.click?.(hit.object)};
  renderer.domElement.addEventListener('pointerdown',pd);renderer.domElement.addEventListener('pointerup',pu);
  const stop=onFrame(dt=>{if(!visible||document.hidden)return;current.time+=dt;current.model.update?.(Math.min(dt,.04),runtime.reduced?0:current.time);orbit.update();renderer.render(scene,view)});
  return()=>{stage.current=null;stop();ro.disconnect();io.disconnect();orbit.dispose();current.model.dispose?.();disposeScene(scene);renderer.domElement.removeEventListener('pointerdown',pd);renderer.domElement.removeEventListener('pointerup',pu);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()};
 },[]);
 useEffect(()=>{
  const current=stage.current;if(!current)return;
  current.model.dispose?.();disposeScene(current.scene);current.time=0;
  current.scene.add(new T.HemisphereLight(0xfff9ec,0x879b76,1.4));const light=new T.DirectionalLight(0xffe8e8,1.5);light.position.set(-5,12,8);light.castShadow=true;current.scene.add(light);
  current.model=build(current.scene,current.context);inkSilhouettes(current.scene);
  const seen=new Set<T.Material>();current.scene.traverse(object=>{if(object instanceof T.Mesh&&object.material instanceof T.MeshToonMaterial&&!seen.has(object.material)){seen.add(object.material);const h={h:0,s:0,l:0};object.material.color.getHSL(h);object.material.color.set(h.l<.22?0x40594b:h.l>.87?0xf8f4e8:h.h>.45&&h.h<.75?0x9bb995:h.h<.15?0xd8b6a3:object.material.color)}});
 },[build]);
 return <div ref={host} className="play-stage" role="group" aria-label={label}/>;
}
