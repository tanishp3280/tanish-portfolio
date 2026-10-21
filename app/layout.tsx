import type { Metadata } from 'next';
import './globals.css';
import './redesign.css';
import './expansion.css';
import './reference.css';
import './spatial.css';
import './sky.css';
import './immersive.css';
import './cartoon-universe.css';
import './mountain-city.css';
export const metadata:Metadata={manifest:"/manifest.webmanifest",metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : 'http://localhost:3000')),title:{default:'Tanish Patil — Curious by default',template:'%s · Tanish Patil'},description:'Quantitative thinking, engineering instinct, human impact. Explore the work and world of Tanish Patil.',openGraph:{title:'Tanish Patil',description:'Quantitative thinking. Engineering instinct. Human impact.',images:['/icon-512.png']},icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark" suppressHydrationWarning><body>{children}</body></html>}
