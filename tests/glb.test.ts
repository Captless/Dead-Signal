import { describe, expect, it } from 'vitest';import * as T from 'three';import { zombieReady, buildZombie, clipKey } from '../src/assets/zombies';import { E } from '../src/enemies/Enemy';
describe('glb',()=>{
it('falls back to procedural when not preloaded',()=>{expect(zombieReady()).toBe(false);expect(buildZombie('drifter')).toBe(null);const e=new E(0,5);expect((e as unknown as {glb:null}).glb).toBe(null);});
it('maps Sketchfab clip names',()=>{expect(clipKey('Armature|Attack')).toBe('attack');expect(clipKey('Armature|Death')).toBe('death');expect(clipKey('Armature|Walk')).toBe('walk');});
it('procedural zone passes through',()=>{const e=new E(0,5);expect(e.zoneAt(new T.Vector3(), 'arm')).toBe('arm');expect(e.zoneAt(new T.Vector3(), 'head')).toBe('head');});
});
