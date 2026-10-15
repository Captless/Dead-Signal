export type Z='head'|'body'|'arm'|'leg';
export const ZR:Record<Z,[number,number]>={head:[1.8,2.4],body:[0.8,1.05],arm:[0.5,0.7],leg:[0.55,0.75]};
export const dmg=(base:number,z:Z,rnd=Math.random)=>Math.round(base*(ZR[z][0]+rnd()*(ZR[z][1]-ZR[z][0])));
export function transfer(mag:number,res:number,size:number){const n=Math.min(size-mag,res);return{mag:mag+n,res:res-n};}
