'use client';
import {mountainDistricts} from '@/lib/mountain-districts';
import {cityDirector,useCityDirector} from '@/lib/city/director';
import {requestNavigation} from '@/lib/spatial';
export default function SilkRibbon(){const state=useCityDirector();return <nav className="city-silk" aria-label="Silk district ribbon"><svg viewBox="0 0 36 352" preserveAspectRatio="none" aria-hidden="true"><path d="M18 0C-5 45 41 70 18 105S-5 170 18 210 41 280 18 352" fill="none" stroke="#b3c6a7" strokeWidth="9"/><path d="M18 0C-5 45 41 70 18 105S-5 170 18 210 41 280 18 352" fill="none" stroke="#ebc8d3" strokeWidth="2" strokeDasharray="3 5"/></svg>{mountainDistricts.map((d,i)=><button key={d.id} aria-label={d.name} aria-current={state.active===i?'location':undefined} onClick={()=>{cityDirector.stop();requestNavigation('#'+d.id)}}><b>{d.symbol}</b><span><i aria-hidden="true">⌂</i>{d.name}<small>{d.hint}</small></span></button>)}</nav>}
