import { describe, expect, it } from 'vitest';import { parade } from '../src/world/ParadeBuilder';import { street } from '../src/world/StreetBuilder';import { blank, validMeta } from '../src/meta/profile';import { banner } from '../src/assets/textureFactory';
const inSolid=(x:number,z:number,s:{x:number;z:number;w:number;d:number})=>Math.abs(x-s.x)<=s.w/2&&Math.abs(z-s.z)<=s.d/2;
describe('parade',()=>{
it('matches street builder contract',()=>{const a=parade();const s=street();for(const k of ['group','cw','walls','spawns','player0','lamps','crates','crateMeshes','fogNear','fogFar','solids','nav'] as const)expect(a[k]).toBeDefined();expect(JSON.stringify(Object.keys(a).sort())).toBe(JSON.stringify(Object.keys(s).sort()));});
it('spawns clear of solids and in nav bounds',()=>{const a=parade();expect(a.spawns.length).toBe(8);for(const p of a.spawns){expect(a.solids.some(s=>inSolid(p.x,p.z,s))).toBe(false);expect(p.x).toBeGreaterThanOrEqual(a.nav.x0);expect(p.x).toBeLessThanOrEqual(a.nav.x0+a.nav.nx);expect(p.z).toBeGreaterThanOrEqual(a.nav.z0);expect(p.z).toBeLessThanOrEqual(a.nav.z0+a.nav.nz);}});
it('player start clear and crates match meshes',()=>{const a=parade();expect(a.solids.some(s=>inSolid(a.player0.x,a.player0.z,s))).toBe(false);expect(a.crates.length).toBe(a.crateMeshes.length);expect(a.lamps.length).toBeLessThanOrEqual(8);});
it('banner sigil texture exists',()=>{expect(banner()).toBeDefined();});
it('map select persists with migration',()=>{expect(blank().map).toBe('street');expect(validMeta({map:'parade'}).map).toBe('parade');expect(validMeta({map:'moon'}).map).toBe('street');expect(validMeta({}).map).toBe('street');expect(validMeta(null).map).toBe('street');});
});
