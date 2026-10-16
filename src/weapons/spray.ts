// CSS-style heat model: sustained fire builds heat (uncapped above, display clamps at 2).
// Shake amplitude, spread bloom and spray sway all scale with heat; first shot is clean.
export const heat=(recT:number,maxRise:number)=>maxRise<=0?0:Math.min(2,Math.max(0,recT/maxRise));
export const shakeAmp=(sa:number,h:number)=>sa*(1+2*h);
export const swayDir=(n:number)=>Math.floor(n/3)%2?-1:1;
// fixed learnable spray: shots 1-2 laser per pull, centered wander from shot 3 (NDC spread-units, +y = up).
// x alternates L/R around 0, y biased upward (inverted-7/T) — never a straight line. tables loop with +8%/loop (cap 1.1x)
// so sustained fire never degrades to a laser. base magnitude flattened (0.6 + m/16) so default spray stays tight.
const TBL:Record<string,[number,number][]>={
smg:[[0,1],[-0.4,1.2],[0.4,1],[-0.2,0.8],[0.5,1],[-0.5,0.7],[0.3,0.9],[-0.3,0.5],[0.4,0.6],[-0.2,0.4]],
rapid:[[0,1],[-0.3,1.2],[0.3,1],[-0.2,0.8],[0.4,0.9],[-0.4,0.6],[0.2,0.8],[-0.2,0.4],[0.3,0.5],[-0.1,0.3]],
rifle:[[0,1.2],[-0.3,1.4],[0.3,1.6],[-0.6,1.4],[0.6,1.2],[-0.4,1],[0.8,1.1],[-0.8,0.8],[0.5,0.9],[-0.5,0.6],[0.7,0.7],[-0.4,0.4]],
lmg:[[0,1],[-0.35,1.2],[0.35,1.3],[-0.55,1],[0.55,1.2],[-0.4,0.9],[0.7,1],[-0.7,0.7],[0.5,0.8],[-0.5,0.5],[0.65,0.6],[-0.4,0.4]]};
const DEFP=[[0,1],[-0.4,1.1],[0.4,0.9],[-0.2,0.7],[0.5,0.8],[-0.5,0.5],[0.3,0.6],[-0.3,0.3],[0.2,0.4]] as [number,number][];
export const patOff=(kind:string,n:number)=>{if(n<2)return{x:0,y:0};const t=TBL[kind]??DEFP;const m=n-2;const i=m%t.length;const s=Math.min(1.1,(0.55+m/20)*(1+0.08*Math.floor(m/t.length)));return{x:t[i][0]*s*0.64,y:t[i][1]*s*0.85};};
export const patMag=(n:number)=>n<2?0:Math.min(1,(n-1)/8);
export const moveMul=(run:boolean,air:boolean)=>(run?1.6:1)*(air?1.8:1);
export const capShake=(sa:number,shake:number)=>Math.min(sa,shake*2);
