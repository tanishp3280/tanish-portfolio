import * as T from 'three';
import {WaterField} from '@/lib/city/water';
/** Actual intersecting waves displace the surface; dormant ponds do no simulation work. */
export function createWaterSurface(pond:T.Mesh){
 const field=new WaterField(),texture=new T.DataTexture(field.values,field.size,field.size,T.RedFormat,T.FloatType);
 texture.minFilter=texture.magFilter=T.LinearFilter;texture.needsUpdate=true;
 const geometry=new T.PlaneGeometry(2.44,2.44,47,47);geometry.rotateX(-Math.PI/2);
 const material=new T.ShaderMaterial({transparent:true,side:T.DoubleSide,depthWrite:false,uniforms:{time:{value:0},heightMap:{value:texture}},vertexShader:`uniform sampler2D heightMap;varying vec2 waterPoint;varying float height;void main(){waterPoint=position.xz;height=texture2D(heightMap,waterPoint/2.44+.5).r;vec3 p=position;p.y+=height*1.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,fragmentShader:`varying vec2 waterPoint;varying float height;uniform float time;void main(){if(length(waterPoint)>1.22)discard;float shimmer=sin(waterPoint.x*11.+time*.4)*sin(waterPoint.y*8.-time*.3)*.025;vec3 color=mix(vec3(.61,.75,.65),vec3(.97,.96,.87),clamp(.35+height*8.+shimmer,0.,1.));gl_FragColor=vec4(color,.7);}`});
 const surface=new T.Mesh(geometry,material);surface.position.y=.05;pond.add(surface);let lastTime:number|null=null;
 return{poke(point:T.Vector3,t:number){const local=pond.worldToLocal(point.clone());field.disturb(local.x,local.z);pond.userData.disturbance={x:local.x,z:local.z,time:t}},update(t:number){material.uniforms.time.value=t;const dt=lastTime===null?0:Math.max(0,t-lastTime);lastTime=t;if(field.update(dt)){texture.image.data=field.values;texture.needsUpdate=true}},dispose(){geometry.dispose();material.dispose();texture.dispose();surface.removeFromParent()}};
}
