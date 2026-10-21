'use client';
import {useRef,type ReactNode} from 'react';
import {motion,useScroll,useTransform,useSpring,useReducedMotion} from 'motion/react';
import {useSettings} from '../Shell';
export default function ScrollPassage({children,index}:{children:ReactNode;index:number}){
 const ref=useRef<HTMLDivElement>(null),{reduced}=useSettings(),os=useReducedMotion(),quiet=!!(reduced||os);
 const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});
 const p=useSpring(scrollYProgress,{stiffness:130,damping:32,mass:.5});
 const opacity=useTransform(p,[0,.15,.7,.96],[0,1,1,0]);
 const x=useTransform(p,[0,.25,.7,1],[index%2?95:-95,0,0,index%2?-55:55]);
 const y=useTransform(p,[0,.25,.7,1],[55,0,0,-65]);
 const scale=useTransform(p,[0,.25,.55,1],[.87,1,1.025,.91]);
 const rotate=useTransform(p,[0,.3,.7,1],[index%2?3:-3,0,0,index%2?-2:2]);
 return <motion.div ref={ref} className="story-floating-copy kinetic-passage" data-quiet={quiet} style={quiet?{}:{opacity,x,y,scale,rotate}}>{children}</motion.div>
}
