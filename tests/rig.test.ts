import { describe, expect, it } from 'vitest';import { fallbackZombie } from '../src/assets/zombies/fallback';
const PIV=['armL','armR','legL','legR','elbL','elbR','knL','knR','head','torso','jaw'];
describe('rig',()=>{it('preload fallback rig exposes every anim pivot',()=>{const g=fallbackZombie('brute',0);for(const k of PIV)expect(g.userData[k],'pivot '+k).toBeDefined();});});
