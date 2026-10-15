// CSS-style heat model: sustained fire builds heat (uncapped above, display clamps at 2).
// Shake amplitude, spread bloom and spray sway all scale with heat; first shot is clean.
export const heat=(recT:number,maxRise:number)=>maxRise<=0?0:Math.min(2,Math.max(0,recT/maxRise));
export const shakeAmp=(sa:number,h:number)=>sa*(1+2*h);
export const bloom=(sp:number,h:number)=>sp*(1+1.5*h);
export const swayDir=(n:number)=>Math.floor(n/3)%2?-1:1;
