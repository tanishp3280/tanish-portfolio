type Bird={x:number;y:number;z:number;vx:number;vy:number;vz:number};
/** Deterministic fixed-step flock. Spatial buckets bound neighbour work; snapshots make scrubbing cheap. */
export class PaperFlock {
  birds:Bird[];
  private frame=0;
  private snapshots=new Map<number,Bird[]>();
  constructor(count=180){
    this.birds=Array.from({length:count},(_,i)=>({x:Math.cos(i*2.4)*(4+i%7),y:34+i%9,z:Math.sin(i*2.4)*(4+i%7),vx:Math.sin(i)*.6,vy:0,vz:Math.cos(i)*.6}));
    this.snapshots.set(0,this.clone());
  }
  private clone(){return this.birds.map(b=>({...b}))}
  at(seconds:number){
    const target=Math.floor(Math.max(0,Math.min(30,seconds))*30);
    if(target<this.frame){const saved=Math.floor(target/30)*30;let nearest=saved;while(!this.snapshots.has(nearest)&&nearest>0)nearest-=30;this.birds=this.snapshots.get(nearest)!.map(b=>({...b}));this.frame=nearest;}
    while(this.frame<target){this.step();this.frame++;if(this.frame%30===0)this.snapshots.set(this.frame,this.clone());}
    return this.birds;
  }
  private step(){
    const buckets=new Map<string,number[]>(),cell=4,key=(x:number,y:number,z:number)=>`${x},${y},${z}`;
    this.birds.forEach((b,i)=>{const k=key(Math.floor(b.x/cell),Math.floor(b.y/cell),Math.floor(b.z/cell));const list=buckets.get(k)||[];list.push(i);buckets.set(k,list)});
    const next=this.birds.map(b=>({...b}));
    this.birds.forEach((b,i)=>{
      let sx=0,sy=0,sz=0,ax=0,ay=0,az=0,cx=0,cy=0,cz=0,n=0;
      const x=Math.floor(b.x/cell),y=Math.floor(b.y/cell),z=Math.floor(b.z/cell);
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)for(const j of buckets.get(key(x+dx,y+dy,z+dz))||[]){
        if(j===i)continue;const other=this.birds[j],rx=b.x-other.x,ry=b.y-other.y,rz=b.z-other.z,d2=rx*rx+ry*ry+rz*rz;
        if(d2>16||d2<.00001)continue;
        n++;cx+=other.x;cy+=other.y;cz+=other.z;ax+=other.vx;ay+=other.vy;az+=other.vz;
        if(d2<2){sx+=rx/d2;sy+=ry/d2;sz+=rz/d2;}
      }
      const angle=this.frame/30*.18,r=9,goalX=Math.cos(angle)*r,goalZ=Math.sin(angle)*r;
      let vx=b.vx+((goalX-b.x)*.12+sx*.9+(n?(cx/n-b.x)*.1+(ax/n-b.vx)*.8:0))/30;
      let vy=b.vy+((38+Math.sin(angle*2)*3-b.y)*.15+sy*.9+(n?(cy/n-b.y)*.1+(ay/n-b.vy)*.8:0))/30;
      let vz=b.vz+((goalZ-b.z)*.12+sz*.9+(n?(cz/n-b.z)*.1+(az/n-b.vz)*.8:0))/30;
      const limit=Math.max(1,Math.hypot(vx,vy,vz)/4);vx/=limit;vy/=limit;vz/=limit;
      next[i]={x:b.x+vx/30,y:b.y+vy/30,z:b.z+vz/30,vx,vy,vz};
    });this.birds=next;
  }
}
