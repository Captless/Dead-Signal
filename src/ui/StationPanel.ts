import { Inv, slotFor } from '../progression/PurchaseService';import { PRICE, PERKS } from '../config/upgrades';import { WP, CAT, Cat } from '../config/weapons';
// click-leak guard: ignore clicks within EAT_MS of open, or clicks whose
// pointerdown started outside the panel (e.g. LMB held from firing).
export const EAT_MS=250;export const CLEAR_DELAY=2.5;
export function gate(openedAt:number,downAt:number,downInside:boolean,now:number){return downInside&&downAt>=openedAt&&now-openedAt>=EAT_MS;}
export function shouldAutoOpen(cur:string,panelOpen:boolean,autoWave:number,wave:number){return cur==='INTERMISSION'&&!panelOpen&&autoWave!==wave;}
let lastTab='pistols';let armed:string|null=null;
const ROLES:Record<string,string>={pistol:'Accurate starter sidearm',heavy:'Slow heavy hitter',smg:'Sustained rapid fire',rapid:'Faster hose, hungrier',rifle:'Versatile mid-range',marksman:'Slow, heavy, precise',shotgun:'Close-range burst',lmg:'100-round hose'};
const CATS:Record<string,Cat>={pistols:'pistol',smgs:'smg',rifles:'rifle',heavy:'heavy'};
const TABS=['pistols','smgs','rifles','heavy','perks','supply'];
export function panel(inv:Inv,scrap:number,buy:(a:string)=>string,since?:number,opts?:{deploy:boolean;wave:number}):HTMLDivElement{
const root=document.createElement('div');root.className='st-scrim';
const openedAt=since??performance.now();let downAt=0,downInside=false;
root.addEventListener('pointerdown',e=>{downAt=performance.now();downInside=(e.target as HTMLElement).closest('.st-panel')!=null;});
root.addEventListener('keydown',e=>{if(e.code==='Escape'&&armed){armed=null;draw();e.stopPropagation();}});
const costOf=(f:string):number=>{const[a,k]=f.split(':');if(a==='buy')return (PRICE as Record<string,number>)[k]??0;if(a==='perk')return PERKS[k]?PERKS[k].cost:0;return 0;};
const dis=(ok:boolean,why:string)=>ok?'':`disabled data-why="${why}"`;
const card=(title:string,sub:string,stats:string,btn:string,f:string,can:boolean,why:string,_big:boolean)=>{
const armedNow=armed===f;const label=!can?why:armedNow?'SURE?':btn;
return `<div class="st-card"><div class="st-name">${title}</div><div class="st-sub">${sub}</div><div class="st-stats">${stats}</div><button data-f="${f}" ${dis(can,why)} class="${armedNow?'armed':''}">${label}</button></div>`;};
const draw=()=>{
let h=`<div class="st-panel"><div class="st-head"><div><div class="st-title">FIELD STATION</div><div class="st-hint">B / E / Esc close · Enter deploys</div></div><div class="st-scrap">◈ ${scrap}</div><button id="stx" title="Close (B/E/Esc)" style="background:none;border:1px solid var(--line-700);color:var(--text-100);font-size:16px;width:32px;height:32px;cursor:pointer;flex:none">×</button></div>${opts?.deploy?`<button id="stgo" style="width:100%;margin:8px 0;padding:14px;font-size:17px;font-weight:800;letter-spacing:.08em;background:var(--amber-500);color:#111;border:0;cursor:pointer">CONTINUE →</button><div style="color:var(--text-300);font-size:12px;margin:-2px 0 8px">NEXT: WAVE ${opts.wave}</div>`:''}<div class="st-tabs">`;
for(const t of TABS)h+=`<button data-tab="${t}" class="st-tab${lastTab===t?' on':''}">${t.toUpperCase()}</button>`;
h+='</div><div class="st-cards">';
if(CATS[lastTab])for(const k of Object.keys(WP).filter(k=>CAT[k]===CATS[lastTab])){const o=inv.owned[k];const p=(PRICE as Record<string,number>)[k];const d=WP[k];
if(!o){const sr=slotFor(inv,k);const rep=sr.replaced?` · REPLACES ${WP[sr.replaced].name.toUpperCase()}`:'';h+=card(d.name,ROLES[k]+rep,`DMG ${d.dmg} · MAG ${d.mag} · ${d.rate}s`,`BUY ${p??''}`,`buy:${k}`,scrap>=(p??1e9),`NEED ${(p??0)-scrap} MORE`,true);}
else{const act=inv.active===k;h+=card(d.name+(act?' · ACTIVE':''),ROLES[k],`DMG ${o.def.dmg} · MAG ${o.def.mag}`,act?'ACTIVE':'SELECT',`select:${k}`,!act,act?'IN USE':'',false);}}
else if(lastTab==='perks')for(const p of Object.keys(PERKS)){const owned=!!inv.perks[p];h+=card(p.toUpperCase(),PERKS[p].desc,owned?'OWNED':`${PERKS[p].cost} SCRAP`,owned?'OWNED':'BUY',`perk:${p}`,!owned,owned?'OWNED':`NEED ${PERKS[p].cost-scrap} MORE`,PERKS[p].cost>=400);}
else if(lastTab==='supply'){for(const k of Object.keys(inv.owned)){const o=inv.owned[k];const full=o.def.startRes>=o.def.cap;h+=card(WP[k].name+' ammo','Reserve refill',full?'FULL':`${o.def.startRes} → ${o.def.cap}`,full?'FULL':'BUY 100',`ammo:${k}`,!full&&scrap>=PRICE.ammo,full?'FULL':`NEED ${PRICE.ammo-scrap} MORE`,false);}
const hf=inv.heals>=3;h+=card('Field dressing','Heal charge (+35 HP)',`x${inv.heals} / 3`,hf?'FULL':'BUY 75','heal',!hf&&scrap>=PRICE.heal,hf?'FULL':`NEED ${PRICE.heal-scrap} MORE`,false);}
h+=`</div><div class="st-msg" id="stmsg"></div></div>`;root.innerHTML=h;
const go=root.querySelector('#stgo') as HTMLButtonElement|null;if(go)go.onclick=()=>{const m=buy('deploy:x');const s=root.querySelector('#stmsg');if(s)s.textContent=m;};
const xx=root.querySelector('#stx') as HTMLButtonElement|null;if(xx)xx.onclick=()=>buy('close:x');
root.querySelectorAll('[data-tab]').forEach(b=>(b as HTMLButtonElement).onclick=()=>{lastTab=(b as HTMLElement).dataset.tab!;armed=null;draw();});
root.querySelectorAll('button[data-f]').forEach(b=>{(b as HTMLButtonElement).onclick=()=>{
if(!gate(openedAt,downAt,downInside,performance.now()))return;
const f=(b as HTMLElement).dataset.f!;
if(costOf(f)>=400&&armed!==f){armed=f;setTimeout(()=>{if(armed===f){armed=null;draw();}},3000);draw();return;}
armed=null;const m=buy(f);const s=root.querySelector('#stmsg');if(s)s.textContent=m;};});};
draw();return root;}
