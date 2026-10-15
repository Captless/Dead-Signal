import { WP, CATALOG } from '../config/weapons';import { comp } from '../config/waves';import type { Meta } from './profile';
// pure intel text: wave composition preview (wave 1 only — no spoilers)
export function threatScan(w:number){const c=comp(w);return Object.keys(c).map(k=>`${c[k]}x ${k.toUpperCase()}`).join(' · ');}
// command-screen main menu. distinct from run HUD: big title, gold status, loadout line.
export function menuMain(o:HTMLElement,gold:number,side:string,c1:string|null,c2:string|null,best:number,cb:Record<string,()=>void>){const load=[side,c1,c2].filter(Boolean).map(k=>WP[k as string].name).join(' / ');
o.innerHTML=`<div class="menu"><h1>DEAD SIGNAL</h1><p>QUARANTINE PROTOCOL · v0.8</p><p style="color:#F0C779">GOLD ${gold} · BEST WAVE ${best}</p><p style="color:#B3BFBA">${load}</p><button data-a="n">NEW RUN</button> <button data-a="h">LOADOUT</button><br><button data-a="s">SETTINGS</button> <button data-a="r">RECORDS</button> <button data-a="c">CREDITS</button></div>`;
for(const k of Object.keys(cb))(o.querySelector(`[data-a="${k}"]`) as HTMLButtonElement).onclick=cb[k];}
// deployment brief: loadout recap + threat scan + gold, then deploy.
export function brief(o:HTMLElement,m:Meta,diff:string,onGo:()=>void,onBack:()=>void){const guns=[m.load.side,m.load.c1,m.load.c2].filter(Boolean) as string[];
const rows=guns.map(k=>{const c=CATALOG[k];return `<div class="st-card"><div class="st-name">${WP[k].name}</div><div class="st-sub">${c.role} · ${c.desc}</div></div>`;}).join('');
o.innerHTML=`<div class="menu"><div class="st-panel" style="text-align:left"><div class="st-title">DEPLOYMENT BRIEF</div><div class="st-hint">DETAIL: ${diff.toUpperCase()} · GOLD ${m.gold}</div><h3 style="color:#B3BFBA">LOADOUT</h3><div class="st-cards">${rows}</div><h3 style="color:#B3BFBA">THREAT SCAN — WAVE 1</h3><p style="color:#F0786E">${threatScan(1)}</p><p style="color:#B3BFBA">Intel covers the first wave only. Deeper waves unknown.</p><div style="text-align:center"><button data-a="go" style="background:#D89A43;border:0;padding:12px 28px;font-weight:800;cursor:pointer">DEPLOY</button> <button data-a="back">BACK</button></div></div></div>`;
(o.querySelector('[data-a="go"]') as HTMLButtonElement).onclick=onGo;(o.querySelector('[data-a="back"]') as HTMLButtonElement).onclick=onBack;}
