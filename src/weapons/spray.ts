// CSS-style heat model: sustained fire builds heat (uncapped above, display clamps at 2).
// Shake amplitude, spread bloom and spray sway all scale with heat; first shot is clean.
export const heat=(recT:number,maxRise:number)=>maxRise<=0?0:Math.min(2,Math.max(0,recT/maxRise));
export const shakeAmp=(sa:number,h:number)=>sa*(1+2*h);
export const bloom=(sp:number,h:number)=>sp*(1+1.5*h);
export const swayDir=(n:number)=>Math.floor(n/3)%2?-1:1;
// fixed learnable spray: shots 1-2 laser per pull, pattern from shot 3 (NDC spread-units, +y = up)
const TBL:Record<string,[number,number][]>={
smg:[[0,1],[0,1.2],[-0.5,1.1],[-0.9,0.8],[-1,0.4],[-0.6,0.2],[0.4,0.5],[0.9,0.6],[1,0.3],[0.5,0]],
rapid:[[0,1],[0.3,1.2],[0.8,1],[1,0.6],[0.6,0.3],[-0.4,0.5],[-0.9,0.6],[-1,0.2],[-0.4,-0.1],[0.4,0]],
rifle:[[0,1.2],[0,1.5],[0,1.7],[-0.5,1.6],[-1.1,1.3],[-1.5,0.9],[-1.2,0.5],[-0.4,0.6],[0.5,0.8],[1,0.9],[1.2,0.5],[0.6,0.2]],
lmg:[[0,1],[0,1.3],[-0.4,1.4],[-0.9,1.2],[-1.2,0.8],[-0.8,0.5],[0.2,0.7],[0.9,0.9],[1.3,0.7],[1,0.3],[0.3,0.2],[-0.5,0.4]]};
const DEFP=[[0,1],[0,1.2],[-0.5,1],[-1,0.7],[-0.7,0.3],[0.3,0.5],[0.8,0.6],[0.9,0.2],[0.3,0]] as [number,number][];
export const patOff=(kind:string,n:number)=>{if(n<2)return{x:0,y:0};const t=TBL[kind]??DEFP;const i=Math.min(n-2,t.length-1);const s=Math.min(1,0.5+(n-2)/8);return{x:t[i][0]*s,y:t[i][1]*s};};
export const patMag=(n:number)=>n<2?0:Math.min(1,(n-1)/8);
export const moveMul=(run:boolean,air:boolean)=>(run?1.6:1)*(air?1.8:1);
export const capShake=(sa:number,shake:number)=>Math.min(sa,shake*2);
