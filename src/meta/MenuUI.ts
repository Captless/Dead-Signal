import { comp } from '../config/waves';
// pure intel text: wave composition preview (wave 1 only — no spoilers)
export function threatScan(w:number){const c=comp(w);return Object.keys(c).map(k=>`${c[k]}x ${k.toUpperCase()}`).join(' · ');}
