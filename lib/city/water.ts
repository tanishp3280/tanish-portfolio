/** Damped finite-difference height field; fixed steps keep wave propagation stable. */
export class WaterField {
  readonly size:number;
  values:Float32Array;
  private previous:Float32Array;
  private next:Float32Array;
  private remainder=0;
  active=false;
  constructor(size=48){this.size=size;this.values=new Float32Array(size*size);this.previous=new Float32Array(size*size);this.next=new Float32Array(size*size)}
  disturb(x:number,z:number,strength=.04){
    const cx=(x/2.44+.5)*(this.size-1),cy=(z/2.44+.5)*(this.size-1);
    for(let y=Math.max(1,Math.floor(cy-3));y<Math.min(this.size-1,cy+4);y++)for(let xx=Math.max(1,Math.floor(cx-3));xx<Math.min(this.size-1,cx+4);xx++){
      const d=(xx-cx)**2+(y-cy)**2;this.values[y*this.size+xx]+=Math.exp(-d*.5)*strength;
    }this.active=true;
  }
  update(dt:number){
    if(!this.active)return false;this.remainder+=Math.max(0,Math.min(.1,dt));let changed=false;
    while(this.remainder>=1/60){
      let energy=0;const n=this.size;
      for(let y=1;y<n-1;y++)for(let x=1;x<n-1;x++){
        const i=y*n+x,laplace=this.values[i-1]+this.values[i+1]+this.values[i-n]+this.values[i+n]-4*this.values[i];
        const value=(2*this.values[i]-this.previous[i]+.19*laplace)*.975;
        this.next[i]=value;energy+=Math.abs(value);
      }
      const old=this.previous;this.previous=this.values;this.values=this.next;this.next=old;
      this.remainder-=1/60;changed=true;
      if(energy<.00005){this.values.fill(0);this.previous.fill(0);this.next.fill(0);this.active=false;break;}
    }return changed;
  }
}
