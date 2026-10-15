import { describe, expect, it } from 'vitest';import { drifter, rusher, brute, runner, crusher, stalker } from '../src/assets/zombieModels';
const PIV=['armL','armR','legL','legR','elbL','elbR','knL','knR','head','torso','jaw'];
describe('rig',()=>{it('all builders expose every anim pivot',()=>{for(const b of [drifter,rusher,brute,runner,crusher,stalker]){const g=b(0);for(const k of PIV)expect(g.userData[k],'drifter-like '+k).toBeDefined();}});});
