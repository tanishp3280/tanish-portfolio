'use client';
import {useState} from 'react';
import {cityDirector,useCityDirector} from '@/lib/city/director';
import {mountainDistricts} from '@/lib/mountain-districts';
import {catalog} from '@/lib/catalog';

export default function JourneyGift(){
  const memory=useCityDirector();
  const [opened,setOpened]=useState(memory.discoveries.includes('opened-origami-gift'));
  const districts=memory.visited.map(i=>mountainDistricts[i]);
  const projects=catalog.filter(p=>memory.discoveries.includes('project:'+p.id));
  function download(){
    const escape=(text:string)=>text.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));
    const lines=[...districts.map(d=>d.name),...projects.map(p=>p.title)];
    const height=400+lines.length*30;
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${height}" viewBox="0 0 800 ${height}"><rect width="800" height="${height}" fill="#f7f4e9"/><path d="M200 180L370 65 345 175 510 100 435 210 360 190 300 245Z" fill="#acc0a3" stroke="#456153" stroke-width="3"/><path d="M200 180L345 175 300 245M345 175L360 190 435 210" fill="none" stroke="#dfabc0" stroke-width="3"/><g font-family="Georgia,serif" fill="#345448"><text x="70" y="300" font-size="32">A little mountain memory, from Momo.</text><text x="70" y="342" font-size="18">Your discoveries in Tanish Patil’s portfolio</text>${lines.map((line,i)=>`<text x="70" y="${390+i*30}" font-size="18">${escape(line)}</text>`).join('')}</g></svg>`;
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    const link=document.createElement('a');link.href=url;link.download='my-mountain-journey.svg';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <section className="origami-gift" data-open={opened} aria-label="Momo’s personal origami gift">
    <button className="gift-package" onClick={()=>{setOpened(true);cityDirector.discover('opened-origami-gift')}} aria-label={opened?'Your origami crane':'Unwrap Momo’s gift'}>
      <span className="gift-wrap" aria-hidden="true">✧</span>
      <svg viewBox="0 0 320 200" aria-hidden="true"><path className="crane-wing" d="M30 105L150 15 130 105Z"/><path className="crane-wing opposite" d="M130 105L275 40 205 135Z"/><path d="M30 105L130 105 190 125 100 180Z"/><path d="M190 125L250 80 270 95 245 100 205 135Z"/><path d="M100 180L130 105 155 130Z"/></svg>
    </button>
    {opened?<div className="gift-summary"><h3>Made from your journey.</h3><p>{districts.length} districts and {projects.length} project discoveries folded into one little keepsake.</p><ul>{districts.map(d=><li key={d.id}>{d.name}</li>)}{projects.map(p=><li key={p.id}>{p.title}</li>)}</ul><button onClick={download}>Save my illustrated memory ↗</button><button onClick={()=>{window.dispatchEvent(new CustomEvent('city-controls',{detail:null}));cityDirector.play('gift')}}>Watch Momo assemble it</button></div>:<p>Momo saved a little gift for you. Tap the package to open it.</p>}
  </section>;
}
