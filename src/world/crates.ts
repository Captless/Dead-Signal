export const CRATE_CHARGES=2;export const CRATE_HOLD=0.8;export const CRATE_RANGE=2.6;
export interface CrateSt{x:number;z:number;charges:number}
export const mkCrates=(pts:{x:number;z:number}[]):CrateSt[]=>pts.map(p=>({...p,charges:CRATE_CHARGES}));
export const resetCrates=(cs:CrateSt[])=>{for(const c of cs)c.charges=CRATE_CHARGES;};
// holdE advances progress; returns 'fill' once when threshold crossed (caller refills), 'empty' if depleted.
// edge latch (optional): after a fill, further holds are ignored until E is released (edge.ok reset on release).
export function holdUse(c:CrateSt,holding:boolean,dt:number,prog:{t:number},edge?:{ok:boolean}):'fill'|'empty'|null{if(c.charges<=0){prog.t=0;return holding?'empty':null;}if(!holding){prog.t=0;if(edge)edge.ok=true;return null;}if(edge&&!edge.ok)return null;prog.t+=dt;if(prog.t>=CRATE_HOLD){prog.t=0;c.charges--;if(edge)edge.ok=false;return 'fill';}return null;}