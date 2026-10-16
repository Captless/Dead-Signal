import { buildFrom, preloadZombie, zombieReady, clipKey, glbPlay } from './base';
import type { GlbRig } from './base';
import type { ZVariant } from './types';
import { drifter } from './drifter';
import { rusher } from './rusher';
import { brute } from './brute';
import { runner } from './runner';
import { crusher } from './crusher';
import { stalker } from './stalker';
// Registry: one folder per zombie kind. All kinds share the single rigged GLB, so the
// clip set (walk/attack/death) is identical across the roster — only styling differs.
export const ZOMBIES: Record<string, ZVariant> = { drifter, rusher, brute, runner, crusher, stalker };
export function buildZombie(kind: string): GlbRig | null { return buildFrom(ZOMBIES[kind] ?? ZOMBIES.drifter); }
export { preloadZombie, zombieReady, clipKey, glbPlay };
export type { GlbRig, ZVariant };
