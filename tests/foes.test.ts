import * as T from 'three';import { describe, expect, it } from 'vitest';import { E } from '../src/enemies/Enemy';import { EP } from '../src/config/enemies';import { CW } from '../src/core/CollisionWorld';import { canGo } from '../src/app/GameState';
const cw=new CW();cw.add({minX:99,minZ:99,maxX:100,maxZ:100}); // far away
describe('foes',()=>{
it('hit flinches but does not kill',()=>{const e=new E(0,5);const hp=e.hp;e.hit(5);expect(e.hp).toBe(hp-5);expect(e.fl).toBeGreaterThan(0);expect(e.dead).toBe(false);});
it('flinch freezes movement',()=>{const e=new E(0,5);e.st='chase';e.hit(1);const x=e.pos.x,z=e.pos.z;e.update(0.05,0,0,cw,()=>{});expect(e.pos.x).toBe(x);expect(e.pos.z).toBe(z);});
it('death eases flat then rests above ground',()=>{const kinds=['drifter','rusher','brute','runner','crusher','stalker'] as const;for(const k of kinds){const e=new E(0,5,k);e.hit(9999);for(let i=0;i<30;i++)e.update(0.05,0,0,cw,()=>{});expect(Math.abs(e.mesh.rotation.x)).toBeCloseTo(Math.PI/2);e.mesh.updateMatrixWorld(true);const box=new T.Box3().setFromObject(e.mesh);expect(box.min.y).toBeGreaterThanOrEqual(0.015);const y=e.mesh.position.y;e.update(0.5,0,0,cw,()=>{});expect(e.mesh.position.y).toBe(y);}});
it('brute telegraphs slower than rusher',()=>{expect(EP.brute.windup).toBeGreaterThan(EP.rusher.windup);expect(EP.brute.cd).toBeGreaterThan(EP.rusher.cd);});
it('death only from PLAYING',()=>{expect(canGo('PLAYING','DEAD')).toBe(true);expect(canGo('INTERMISSION','DEAD')).toBe(false);expect(canGo('DEAD','RESULTS')).toBe(true);});
it('windup uses per-kind timing',()=>{const e=new E(0,1.5,'brute');e.st='chase';e.update(0.01,0,0,cw,()=>{});expect(e.st).toBe('windup');expect(e.t).toBeCloseTo(EP.brute.windup);});
it('head tracks within clamp',()=>{const e=new E(0,5);e.st='chase';for(let i=0;i<10;i++)e.update(0.05,3,0,cw,()=>{});const h=(e.mesh.userData as {head:{rotation:{y:number}}}).head.rotation.y;expect(Math.abs(h)).toBeLessThanOrEqual(0.61);});
it('new kinds construct with own stats',()=>{const r=new E(0,5,'runner'),c=new E(0,5,'crusher'),s=new E(0,5,'stalker');expect(r.spd).toBeGreaterThan(EP.rusher.spd);expect(c.hp).toBeGreaterThan(EP.brute.hp);expect(s.hp).toBe(EP.stalker.hp);expect(c.reward).toBeGreaterThan(EP.brute.reward);});
it('stalker strafes off the straight line',()=>{const e=new E(0,10,'stalker');e.st='chase';e.t=0;let mx=0;for(let i=0;i<40;i++){e.update(0.05,0,0,cw,()=>{});mx=Math.max(mx,Math.abs(e.pos.x));}expect(mx).toBeGreaterThan(0.05);});
it('far foes skip rig anim but still move',()=>{const e=new E(0,60);e.st='chase';e.t=0;e.update(0.05,0,0,cw,()=>{});expect(e.pos.z).toBeLessThan(60);const r=e.mesh.userData as {legL:{rotation:{x:number}}};expect(r.legL.rotation.x).toBe(0);});
});
