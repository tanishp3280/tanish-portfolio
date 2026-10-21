import * as T from 'three';

/** A single scene render, depth-aware restrained focus, and edge-only ink motion accents. */
export function createCinematicLens(renderer: T.WebGLRenderer, camera: T.PerspectiveCamera) {
  const target = new T.WebGLRenderTarget(1, 1, {type:T.HalfFloatType});
  target.samples=4;
  target.depthTexture = new T.DepthTexture(1, 1, T.UnsignedIntType);
  const uniforms = {
    image:{value:target.texture}, depth:{value:target.depthTexture},
    pixels:{value:new T.Vector2(1,1)}, near:{value:camera.near}, far:{value:camera.far},
    focus:{value:8}, strength:{value:0}, speed:{value:0}, time:{value:0},
  };
  const material = new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms,
    vertexShader:'varying vec2 uvLens;void main(){uvLens=uv;gl_Position=vec4(position.xy,0.,1.);}',
    fragmentShader:`
      #include <packing>
      varying vec2 uvLens;
      uniform sampler2D image, depth;
      uniform vec2 pixels;
      uniform float near,far,focus,strength,speed,time;
      float distanceAt(vec2 uv){return -perspectiveDepthToViewZ(texture2D(depth,uv).x,near,far);}
      void main(){
        float centerDepth=distanceAt(uvLens);
        float blur=smoothstep(1.5,12.,abs(centerDepth-focus))*strength;
        vec4 color=texture2D(image,uvLens);float weight=1.;
        for(int i=0;i<12;i++){
          float a=float(i)*2.399963;
          vec2 offset=vec2(cos(a),sin(a))*sqrt((float(i)+1.)/12.)*blur*3.5/pixels;
          vec2 uv=clamp(uvLens+offset,vec2(.001),vec2(.999));
          float sampleDepth=distanceAt(uv);
          float valid=1.-smoothstep(1.,3.,abs(sampleDepth-centerDepth));
          color+=texture2D(image,uv)*valid;weight+=valid;
        }
        color/=weight;
        vec2 point=uvLens-.5;float angle=atan(point.y,point.x);
        float stroke=pow(max(0.,sin(angle*43.+sin(angle*7.)*.6)),38.);
        float edge=smoothstep(.3,.62,length(point));
        float broken=smoothstep(.1,.9,sin(length(point)*27.-time*9.+angle*3.));
        float ink=stroke*edge*broken*speed*.22;
        color.rgb=mix(color.rgb,vec3(.12,.22,.17),ink);
        color.a=max(color.a,ink);
        gl_FragColor=color;
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`});
  const quad = new T.Mesh(new T.PlaneGeometry(2,2),material);
  const scene = new T.Scene();scene.add(quad);
  const screenCamera = new T.Camera();
  let focus = 8, strength = 0, speed = 0;
  return {
    resize(width:number,height:number){target.setSize(width,height);uniforms.pixels.value.set(width,height)},
    render(world:T.Scene,dt:number,seconds:number,options:{focus:number;close:boolean;velocity:number;reduced:boolean;quality:number}){
      const blend=1-Math.exp(-Math.max(0,dt)*3);
      focus+=(options.focus-focus)*blend;
      strength+=((options.close&&!options.reduced&&options.quality>0?1:0)-strength)*blend;
      speed+=((options.reduced?0:T.MathUtils.clamp((options.velocity-18)/65,0,1))-speed)*(1-Math.exp(-Math.max(0,dt)*8));
      uniforms.focus.value=focus;uniforms.strength.value=strength;uniforms.speed.value=speed;uniforms.time.value=seconds;
      if(strength<.005&&speed<.005){renderer.setRenderTarget(null);renderer.render(world,camera);return;}
      renderer.setRenderTarget(target);renderer.render(world,camera);
      renderer.setRenderTarget(null);renderer.render(scene,screenCamera);
    },
    dispose(){target.depthTexture?.dispose();target.dispose();material.dispose();quad.geometry.dispose()},
  };
}
