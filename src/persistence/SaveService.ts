import { DEF, clampS, Sfx } from '../config/settings';import { SCHEMA_V, validRec, migrate, Recs } from './saveSchema';
export class Save{ok=true;private mem=new Map<string,string>();private get(k:string){try{const v=localStorage.getItem(k);if(v!=null)return v;}catch{this.ok=false;}return this.mem.get(k)??null;}private put(k:string,v:string){try{localStorage.setItem(k,v);}catch{this.ok=false;}this.mem.set(k,v);}
settings():Sfx{const r=this.get('ds-settings');if(!r)return{...DEF};try{return clampS(JSON.parse(r));}catch{return{...DEF};}}
saveSettings(s:Sfx){this.put('ds-settings',JSON.stringify(s));}
records():Recs{return migrate(this.get('ds-records')).rec;}
saveRecords(r:Recs){this.put('ds-records',JSON.stringify({v:SCHEMA_V,...validRec(r)}));}
resetRecords(){this.put('ds-records',JSON.stringify({v:SCHEMA_V,best:0,kills:0,time:0}));}}