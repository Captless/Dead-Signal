import { describe, expect, it } from 'vitest';import { PC } from '../src/player/PlayerController';import { CW } from '../src/core/CollisionWorld';
const dt=1/60;const inp=(sp:boolean)=>({take:()=>({dx:0,dy:0}),axis:()=>({x:0,z:0}),keys:new Set(sp?['Space']:[]),fire:false} as any);
function jump(){const p=new PC();const cw=new CW();p.update(dt,inp(true),cw);return {p,cw};}
describe('jump',()=>{it('apex ~1.2m, airtime <0.85s, lands grounded',()=>{const {p,cw}=jump();let apex=0,t=0;p.update(dt,inp(false),cw);while(!p.grounded&&t<2){p.update(dt,inp(false),cw);apex=Math.max(apex,p.y);t+=dt;}expect(p.grounded).toBe(true);expect(p.y).toBe(0);expect(apex).toBeGreaterThan(0.9);expect(apex).toBeLessThan(1.6);expect(t).toBeLessThan(0.85);});
it('held space does not re-boost midair',()=>{const {p,cw}=jump();p.update(dt,inp(true),cw);p.update(dt,inp(true),cw);const v2=p.vy;for(let i=0;i<8;i++)p.update(dt,inp(true),cw);expect(p.vy).toBeLessThan(v2);});
it('buffered press jumps on land',()=>{const p=new PC();const cw=new CW();p.update(dt,inp(true),cw);let t=0;while(!p.grounded&&t<2){p.update(dt,inp(false),cw);t+=dt;}p.update(dt,inp(true),cw);expect(p.grounded).toBe(false);});});
