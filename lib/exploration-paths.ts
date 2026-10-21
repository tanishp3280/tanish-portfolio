export const explorationPaths=[
 {id:'quant',name:'Math & finance',icon:'∑',description:'Research, tools, and quantitative projects.',chapters:[2,4,5,7,10]},
 {id:'build',name:'Build & invent',icon:'⚙',description:'Robotics, software, and the people behind them.',chapters:[1,4,5,6,10]},
 {id:'teach',name:'Teach & lead',icon:'✦',description:'The communities I teach, support, and grow.',chapters:[8,6,7,10]}
];
export function adjacentChapters(active:number,path:number[]){const index=path.indexOf(active);return {previous:index>0?path[index-1]:null,next:index>=0?path[index+1]??null:path.find(i=>i>active)??path[0]??null}}
