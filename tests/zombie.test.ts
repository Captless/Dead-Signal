import { describe, expect, it } from 'vitest';import * as T from 'three';import { EP } from '../src/config/enemies';import { ZOMBIES } from '../src/assets/zombies';import { fallbackZombie } from '../src/assets/zombies/fallback';
const JOINTS=['armL','armR','legL','legR','elbL','elbR','knL','knR','head','torso','jaw'];
describe('zombies',()=>{
it('hp buffed across roster',()=>{expect(EP.drifter.hp).toBe(110);expect(EP.rusher.hp).toBe(65);expect(EP.brute.hp).toBe(400);expect(EP.runner.hp).toBe(60);expect(EP.crusher.hp).toBe(650);expect(EP.stalker.hp).toBe(130);});
it('every kind is a registered GLB variant with own stats',()=>{const ids=Object.keys(ZOMBIES).sort();expect(ids).toEqual(['brute','crusher','drifter','runner','rusher','stalker']);for(const k of ids)expect(EP[k]).toBeDefined();});
it('variants differ by height and body shape',()=>{const hs=new Set(Object.values(ZOMBIES).map(v=>v.height));const gs=new Set(Object.values(ZOMBIES).map(v=>v.girth));expect(hs.size).toBeGreaterThan(1);expect(gs.size).toBeGreaterThan(1);});
it('fallback keeps joints, sway rig and zone tags',()=>{const g=fallbackZombie('drifter',0);for(const j of JOINTS)expect(g.userData[j]).toBeDefined();const sw=(g.userData as {sway:{o:T.Group;ph:number}[]}).sway;expect(Array.isArray(sw)).toBe(true);expect(sw.length).toBeGreaterThan(0);let zones=0;g.traverse(o=>{if((o as T.Mesh).isMesh&&(o as unknown as {userData:{zone?:string}}).userData.zone)zones++;});expect(zones).toBeGreaterThan(0);});
});
