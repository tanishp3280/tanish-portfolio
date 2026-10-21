export const SKY_PAGES=[
 {id:'home',label:'Home',href:'/',caption:'A little world of my work',number:'01'},
 {id:'skills',label:'The workshop',href:'/skills',caption:'Code, tools & experiments',number:'02'},
 {id:'experience',label:'My journey',href:'/experience',caption:'Experience & leadership',number:'03'},
 {id:'research',label:'Research',href:'/research',caption:'Questions worth following',number:'04'},
 {id:'projects',label:'Projects',href:'/work',caption:'Things I have built',number:'05'},
 {id:'resume',label:'Résumé',href:'/resume',caption:'The complete picture',number:'06'},
 {id:'contact',label:'Say hello',href:'/contact',caption:'Start a conversation',number:'07'},
 {id:'map',label:'Sky district',href:'/map',caption:'Explore the neighborhood',number:'08'},
 {id:'studio',label:'Idea garden',href:'/studio',caption:'STEMPulse & growing ideas',number:'09'}
];
export type SkyKind='city'|'desk'|'penguin'|'ferry'|'observatory'|'quant'|'robot'|'sorting'|'train'|'book'|'mail'|'garden'|'dice'|'trophy'|'orbits';
export const SKY_COMPONENTS:{id:SkyKind;title:string;description:string;action:string;route:string}[]=[
 {id:'city',title:'Sky district',description:'Orbit a miniature neighborhood. Each building opens a different part of my portfolio.',action:'Visit a building',route:'/map'},
 {id:'desk',title:'After-school studio',description:'A little developer at work. Switch between code, research and a well-earned break.',action:'Change activity',route:'/work'},
 {id:'penguin',title:'Pip the penguin',description:'Your tiny travel companion. Wave, hop, or send Pip skating.',action:'Say hi to Pip',route:'/'},
 {id:'ferry',title:'Paper-plane express',description:'Send a paper glider across the district. Choose its next destination.',action:'Launch flight',route:'/map'},
 {id:'observatory',title:'The observatory',description:'Aim the telescope and explore questions in computational neuroscience and quantitative research.',action:'Aim telescope',route:'/research'},
 {id:'quant',title:'Probability engine',description:'Adjust uncertainty and watch a 3D distribution change. Synthetic illustration, never a market forecast.',action:'Adjust uncertainty',route:'/quant'},
 {id:'robot',title:'Workshop assistant',description:'Give the robot a tool. It connects documented skills to the projects that use them.',action:'Choose a skill',route:'/skills'},
 {id:'sorting',title:'Sorting factory',description:'An actual bubble-sort step moves the bars. Compare, swap, reset, and watch order emerge.',action:'Compare next pair',route:'/algorithms'},
 {id:'train',title:'The journey line',description:'A tiny train stops at documented experiences. Select a station to read about that work.',action:'Next station',route:'/experience'},
 {id:'book',title:'The blue notebook',description:'Turn the physical cover and leaf through skills, experience and the résumé download.',action:'Turn a page',route:'/resume'},
 {id:'mail',title:'Airmail station',description:'Open the mailbox and launch a letter, then write to me with your own email app.',action:'Launch a letter',route:'/contact'},
 {id:'garden',title:'Idea garden',description:'An automatically growing garden representing the learning community built through STEMPulse.',action:'Plant a tree',route:'/studio'},
 {id:'dice',title:'Chance cube',description:'Roll a numbered cube. The resting face and result agree.',action:'Roll the cube',route:'/studio'},
 {id:'trophy',title:'The trophy room',description:'Rotate through documented team and individual achievements.',action:'Next achievement',route:'/awards'},
 {id:'orbits',title:'Project satellites',description:'Select an orbiting project to bring its model into focus and open the case study.',action:'Next project',route:'/work'}
];
