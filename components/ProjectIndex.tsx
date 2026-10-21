'use client';
import SkyObject from './sky/SkyObject';
import Shell from './Shell';import Projects from './Projects';
export default function ProjectIndex(){return <Shell><main className="inner-main" id="main"><header className="inner-heading"><p className="eyebrow">THE WORK / FOLLOW YOUR CURIOSITY</p><h1>Ideas in<br/><em>working form.</em></h1><p>Public software and reproducible research. Explore the code on GitHub.</p></header><SkyObject kind="orbits" compact/><Projects all/></main></Shell>}
