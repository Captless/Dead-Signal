import { WP, WD, CAT } from '../config/weapons';import { PRICE, PERKS } from '../config/upgrades';import { Econ } from './Economy';
export interface Slots{side:string;c1:string|null;c2:string|null}
export interface Inv{owned:Record<string,{def:WD}>;active:string;slots:Slots;perks:Record<string,boolean>;heals:number}
export const fresh=():Inv=>({owned:{pistol:{def:{...WP.pistol}}},active:'pistol',slots:{side:'pistol',c1:null,c2:null},perks:{},heals:0});
// which slot a kind takes; second value is the replaced kind (if any)
export function slotFor(inv:Inv,kind:string):{slot:keyof Slots;replaced:string|null}{if(CAT[kind]==='pistol')return{slot:'side',replaced:inv.slots.side===kind?null:inv.slots.side};const act=inv.active;if(act===inv.slots.c1)return{slot:'c1',replaced:inv.slots.c1};if(act===inv.slots.c2)return{slot:'c2',replaced:inv.slots.c2};if(!inv.slots.c1)return{slot:'c1',replaced:null};if(!inv.slots.c2)return{slot:'c2',replaced:null};return{slot:'c1',replaced:inv.slots.c1};}
export class Shop{constructor(private e:Econ,private inv:Inv){}
// atomic: validate all, then mutate. returns ok+msg
buy(kind:string):{ok:boolean;msg:string}{if(this.inv.owned[kind])return{ok:false,msg:'owned'};const p=(PRICE as Record<string,number>)[kind];if(p==null||!WP[kind])return{ok:false,msg:'unknown'};if(!this.e.take(p))return{ok:false,msg:'no scrap'};const{slot,replaced}=slotFor(this.inv,kind);if(replaced)delete this.inv.owned[replaced];this.inv.owned[kind]={def:{...WP[kind]}};this.inv.slots[slot]=kind;return{ok:true,msg:replaced?`bought ${kind} (replaced ${replaced})`:'bought '+kind};}
perk(id:string,apply:(id:string)=>void):{ok:boolean;msg:string}{if(this.inv.perks[id])return{ok:false,msg:'owned'};const p=PERKS[id];if(!p)return{ok:false,msg:'unknown'};if(!this.e.take(p.cost))return{ok:false,msg:'no scrap'};this.inv.perks[id]=true;apply(id);return{ok:true,msg:id};}
ammo(kind:string):{ok:boolean;msg:string}{const o=this.inv.owned[kind];if(!o)return{ok:false,msg:'locked'};if(o.def.startRes>=o.def.cap)return{ok:false,msg:'full'};if(!this.e.take(PRICE.ammo))return{ok:false,msg:'no scrap'};o.def.startRes=o.def.cap;return{ok:true,msg:'ammo full'};}
heal():{ok:boolean;msg:string}{if(this.inv.heals>=3)return{ok:false,msg:'full'};if(!this.e.take(PRICE.heal))return{ok:false,msg:'no scrap'};this.inv.heals++;return{ok:true,msg:'+heal'};}}
