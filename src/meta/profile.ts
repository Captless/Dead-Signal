import { WP } from '../config/weapons';import { PERKS } from '../config/upgrades';
export const META_V=1;
export interface UpLv{d:number;m:number}
export interface Meta{gv:number;gold:number;owned:string[];load:{side:string;c1:string|null;c2:string|null};perks:string[];up:Record<string,UpLv>}
export const blank=():Meta=>({gv:META_V,gold:0,owned:['pistol'],load:{side:'pistol',c1:null,c2:null},perks:[],up:{}});
const isGun=(k:unknown)=>typeof k==='string'&&!!WP[k];
export function validMeta(r:unknown):Meta{const b=blank();if(!r||typeof r!=='object')return b;const o=r as Record<string,unknown>;
const gold=Number(o.gold);b.gold=isFinite(gold)&&gold>0?Math.floor(Math.min(gold,999999)):0;
const ow=Array.isArray(o.owned)?(o.owned as unknown[]).filter(isGun) as string[]:[];b.owned=[...new Set(['pistol',...ow])].filter(isGun);
const l=o.load as Record<string,unknown>|undefined;const pick=(v:unknown,fb:string|null)=>typeof v==='string'&&b.owned.includes(v)?v:fb;
b.load={side:pick(l?.side,'pistol')??'pistol',c1:pick(l?.c1,null),c2:pick(l?.c2,null)};
const pk=Array.isArray(o.perks)?(o.perks as unknown[]).filter(p=>typeof p==='string'&&(PERKS as Record<string,unknown>)[p]) as string[]:[];
b.perks=[...new Set(pk)].slice(0,3);
const up=o.up as Record<string,unknown>|undefined;if(up&&typeof up==='object')for(const k of Object.keys(up)){if(!isGun(k))continue;const u=up[k] as Record<string,unknown>;const d=Number(u?.d),m=Number(u?.m);b.up[k]={d:d>=0&&d<=3?Math.floor(d):0,m:m>=0&&m<=3?Math.floor(m):0};}
return b;}
export const UPG_COST=[0,300,600,1000];
export function upCost(kind:string,cur:number){void kind;return cur<3?UPG_COST[cur+1]??9999:0;}
