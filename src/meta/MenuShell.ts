import { WP } from '../config/weapons';import type { Meta } from './profile';import type { DK } from '../config/difficulty';import type { Sfx } from '../config/settings';import { loadoutHtml, shopHtml, upsHtml, perkHtml, bindHub, icon, Slot } from './HubUI';import { settingsBody, bindSettings } from '../ui/SettingsUI';import { threatScan } from './MenuUI';
export type Page='start'|'loadout'|'shop'|'settings';
export interface ShellCtx{getM:()=>Meta;save:(m:Meta)=>void;diff:()=>DK;setDiff:(d:DK)=>void;map:()=>'street'|'parade';setMap:(v:'street'|'parade')=>void;onStart:()=>void;getS:()=>Sfx;applyS:(s:Sfx)=>void;}
const DIFFS:[DK,string,string][]=[['recruit','RECRUIT','Forgiving patrol'],['standard','STANDARD','Baseline outbreak'],['containment','CONTAINMENT','Brutal quarantine']];
const MAPS:['street'|'parade',string,string][]=[['street','SIGNAL PLAZA','Open square · close ambushes'],['parade','PARADE AVENUE','Long axis · monument cover']];
const PAGES:Page[]=['start','loadout','shop','settings'];
// Full-viewport left rail + content pane. flat blood-console theme via mm- classes.
export function shell(o:HTMLElement,ctx:ShellCtx,first:Page='start'){let page:Page=first;let act:Slot='c1';let dd:DK=ctx.diff();
const R=()=>{const m=ctx.getM();
const rail=PAGES.map(p=>`<button data-pg="${p}" class="${p===page?'on':''}">${p.toUpperCase()}</button>`).join('');
let body='';
if(page==='start'){const guns=[m.load.side,m.load.c1,m.load.c2].filter(Boolean) as string[];
body=`<div class="mm-title">DEPLOYMENT</div><div class="mm-sec">DETAIL — pick your fight</div><div class="mm-cards">${DIFFS.map(d=>`<div class="mm-card${dd===d[0]?' selcard':''}" data-diff="${d[0]}"><div class="mm-gname">${d[1]}</div><div class="mm-gsub">${d[2]}</div></div>`).join('')}</div><div class="mm-sec">THEATER — pick your ground</div><div class="mm-cards">${MAPS.map(v=>`<div class="mm-card${ctx.map()===v[0]?' selcard':''}" data-map="${v[0]}"><div class="mm-gname">${v[1]}</div><div class="mm-gsub">${v[2]}</div></div>`).join('')}</div><div class="mm-sec">STRIKE TEAM</div><div class="mm-slots">${guns.map(k=>`<div class="mm-slot">${icon(k)}<div class="mm-gname">${WP[k].name}</div></div>`).join('')}</div><div class="mm-sec">THREAT SCAN — WAVE 1</div><p class="mm-threat">${threatScan(1)}</p><p class="mm-hint">Intel covers the first wave only. Deeper waves unknown.</p><button class="mm-go" data-a="go">START</button>`;}
else if(page==='loadout'){body=`<div class="mm-title">LOADOUT</div>${loadoutHtml(m,act)}`;}
else if(page==='shop'){body=`<div class="mm-title">SHOP</div>${shopHtml(m)}${upsHtml(m)}${perkHtml(m)}`;}
else{body=`<div class="mm-title">SETTINGS</div><div class="mm-setwrap">${settingsBody(ctx.getS())}</div>`;}
o.innerHTML=`<div class="mm"><div class="mm-rail"><div class="mm-logo">DEAD<br>SIGNAL</div><div class="mm-sub">QUARANTINE PROTOCOL</div>${rail}<div class="mm-gold">GOLD ${m.gold}</div></div><div class="mm-pane">${body}</div></div>`;
o.querySelectorAll<HTMLButtonElement>('[data-pg]').forEach(b=>b.onclick=()=>{page=b.dataset.pg as Page;act='c1';R();});
if(page==='start'){o.querySelectorAll<HTMLElement>('[data-diff]').forEach(c=>c.onclick=()=>{dd=c.dataset.diff as DK;ctx.setDiff(dd);R();});o.querySelectorAll<HTMLElement>('[data-map]').forEach(c=>c.onclick=()=>{ctx.setMap(c.dataset.map as 'street'|'parade');R();});(o.querySelector('[data-a="go"]') as HTMLButtonElement).onclick=()=>ctx.onStart();}
if(page==='loadout'||page==='shop')bindHub(o,m,mm=>ctx.save(mm),R,()=>act,s=>{act=s;});
if(page==='settings'){const w=o.querySelector('.mm-setwrap') as HTMLElement;bindSettings(w,ctx.getS(),s=>ctx.applyS(s));(w.querySelector('[data-a="ok"]') as HTMLButtonElement).onclick=()=>{page='start';R();};(w.querySelector('[data-a="rs"]') as HTMLButtonElement).onclick=()=>{ctx.applyS(null as unknown as Sfx);R();};}};R();}
