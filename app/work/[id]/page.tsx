import CaseStudy from '@/components/CaseStudy';
import {catalog} from '@/lib/catalog';
import {notFound} from 'next/navigation';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=catalog.find(p=>p.id===id);return {title:p?.title||'Project',description:p?.description,openGraph:{title:p?.title,description:p?.description,url:'https://tanish-patil-studio.tppatil.chatgpt.site/work/'+id,images:[]},twitter:{card:'summary',title:p?.title,description:p?.description,images:[]}}}
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const p=catalog.find(x=>x.id===id);if(!p)notFound();return <CaseStudy project={p}/>}
