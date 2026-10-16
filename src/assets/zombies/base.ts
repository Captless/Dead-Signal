import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import glbUrl from '../models/low_poly_zombie.glb?url';
import type { ZVariant } from './types';

// One shared template + clips. Every enemy kind is a variant of this single rig, so all
// kinds animate from the same consistent clip set (Armature|Walk / |Attack / |Death).
let tpl: T.Group | null = null; let clips: T.AnimationClip[] = [];
export async function preloadZombie(): Promise<void> { if (tpl) return; const g = await new GLTFLoader().loadAsync(glbUrl); tpl = g.scene; clips = g.animations; }
export function zombieReady() { return !!tpl; }
export function clipKey(n: string) { return n.split('|').pop()!.toLowerCase(); }
export interface GlbRig { group: T.Group; mixer: T.AnimationMixer; acts: Record<string, T.AnimationAction>; head: T.Object3D; headEnd: T.Object3D | null; headLen: number; mats: T.MeshStandardMaterial[]; cur: string | null; atkRate: number; deathDur: number }

const eyeGeo = new T.SphereGeometry(1, 6, 5);
const stdCache: Record<string, T.MeshStandardMaterial> = {};
function std(c: number, r: number, m = 0) { const k = c + '_' + r + '_' + m; return stdCache[k] ?? (stdCache[k] = new T.MeshStandardMaterial({ color: c, roughness: r, metalness: m })); }
const eyeCache: Record<string, T.MeshBasicMaterial> = {};
function eyeM(c: number) { return eyeCache[c] ?? (eyeCache[c] = new T.MeshBasicMaterial({ color: c })); }
const capCache: Record<string, T.CapsuleGeometry> = {}; const cylCache: Record<string, T.CylinderGeometry> = {};
const cap = (r: number, l: number) => { const k = r + '_' + l; return capCache[k] ?? (capCache[k] = new T.CapsuleGeometry(r, l, 3, 10)); };
const cyl = (r: number, h: number) => { const k = r + '_' + h; return cylCache[k] ?? (cylCache[k] = new T.CylinderGeometry(r, r, h, 12)); };

// Build one variant instance. Returns null until preloadZombie() resolves.
export function buildFrom(v: ZVariant): GlbRig | null {
  if (!tpl) return null;
  const inner = SkeletonUtils.clone(tpl) as T.Group;
  // drop the stray unparented eye mesh (Sketchfab node junk, floats off-skull)
  const drop: T.Object3D[] = []; inner.traverse(o => { const m = o as T.Mesh; if (m.isMesh && /icosphere/i.test(m.name)) drop.push(o); }); drop.forEach(o => o.parent?.remove(o));
  const holder: { o: T.Object3D | null; end: T.Object3D | null } = { o: null, end: null };
  const b: { sp1: T.Object3D | null; sp2: T.Object3D | null; shL: T.Object3D | null; shR: T.Object3D | null; uaL: T.Object3D | null; uaR: T.Object3D | null; ulL: T.Object3D | null; ulR: T.Object3D | null; llL: T.Object3D | null; llR: T.Object3D | null } = { sp1: null, sp2: null, shL: null, shR: null, uaL: null, uaR: null, ulL: null, ulR: null, llL: null, llR: null };
  inner.traverse(o => {
    if (/head_06/i.test(o.name)) holder.o = o; if (/head_end_019/i.test(o.name)) holder.end = o;
    if (/spine1_01/i.test(o.name)) b.sp1 = o; if (/spine2_02/i.test(o.name)) b.sp2 = o;
    if (/shoulder\.l_03/i.test(o.name)) b.shL = o; if (/shoulder\.r_07/i.test(o.name)) b.shR = o;
    if (/upperarm\.l_04/i.test(o.name)) b.uaL = o; if (/upperarm\.r_08/i.test(o.name)) b.uaR = o;
    if (/upperleg\.l_010/i.test(o.name)) b.ulL = o; if (/upperleg\.r_014/i.test(o.name)) b.ulR = o;
    if (/lowerleg\.l_011/i.test(o.name)) b.llL = o; if (/lowerleg\.r_015/i.test(o.name)) b.llR = o;
  });
  // normalize template: feet to y=0, height 1.75, centered XZ, facing +Z (verified)
  inner.updateMatrixWorld(true); const box = new T.Box3().setFromObject(inner);
  const h = Math.max(0.5, box.max.y - box.min.y), s = 1.75 / h;
  const group = new T.Group(); group.add(inner);
  inner.scale.setScalar(s);
  inner.position.set(-(box.min.x + box.max.x) / 2 * s, -box.min.y * s, -(box.min.z + box.max.z) / 2 * s);
  // variant shaping: height (uniform) + girth (XZ bulk) — no bone scaling, so the
  // skinned mesh never shears; bulk comes from the whole-body XZ scale instead.
  const hs = v.height / 1.75; group.scale.set(hs * v.girth, hs, hs * v.girth);
  group.updateMatrixWorld(true);
  // emissive eyes anchored on the head joint -> head tip segment, pushed along +Z
  let headLen = 0.2;
  if (holder.o) {
    const head = holder.o; const hp = new T.Vector3(); head.getWorldPosition(hp);
    const tip = new T.Vector3(); (holder.end ?? head).getWorldPosition(tip); if (holder.end === null) tip.y += 0.2;
    const hl = tip.clone().sub(hp); const L = Math.max(0.08, hl.length()); headLen = L;
    const ctr = hp.clone().addScaledVector(hl, 0.55);
    const xA = new T.Vector3().setFromMatrixColumn(head.matrixWorld, 0).normalize();
    const fwd = new T.Vector3(0, 0, 1).applyQuaternion(group.getWorldQuaternion(new T.Quaternion())).normalize();
    const em = eyeM(v.eye);
    for (const sx of [-1, 1]) { const e = new T.Mesh(eyeGeo, em); e.scale.setScalar(0.14 * L); e.position.copy(head.worldToLocal(ctr.clone().addScaledVector(xA, sx * 0.32 * L).addScaledVector(fwd, 0.42 * L))); head.add(e); }
  }
  // rounded cloth pieces parented to real bones (they deform with the rig, not float).
  // Excluded from the hit-flash list (noflash) so only the skin lights up.
  const shirtM = std(v.shirt, 0.95), pantsM = std(v.pants, 0.98), gearM = std(v.gear, 0.7, 0.12);
  const fit = (bn: T.Object3D | null, geo: T.BufferGeometry, mat: T.MeshStandardMaterial, off: number) => { if (!bn) return; const q = bn.getWorldQuaternion(new T.Quaternion()); const up = new T.Vector3(0, 1, 0).applyQuaternion(q); const p = new T.Vector3(); bn.getWorldPosition(p); p.addScaledVector(up, off); const m = new T.Mesh(geo, mat); m.position.copy(p); m.quaternion.copy(q); m.userData.zone = 'body'; m.userData.noflash = true; group.add(m); group.updateMatrixWorld(true); bn.attach(m); };
  fit(b.sp2, cap(0.15, 0.16), shirtM, -0.04);
  fit(b.sp1, cyl(0.185, 0.06), gearM, 0.02);
  const pr = v.pauldron ?? 1;
  fit(b.shL, cap(0.085 * pr, 0.07), shirtM, 0); fit(b.shR, cap(0.085 * pr, 0.07), shirtM, 0);
  fit(b.uaL, cap(0.068, 0.13), shirtM, 0.04); fit(b.uaR, cap(0.068, 0.13), shirtM, 0.04);
  fit(b.ulL, cap(0.10, 0.18), pantsM, 0.02); fit(b.ulR, cap(0.10, 0.18), pantsM, 0.02);
  fit(b.llL, cyl(0.075, 0.06), pantsM, 0.02); fit(b.llR, cyl(0.075, 0.06), pantsM, 0.02);
  if (v.cap) fit(holder.o, cyl(0.15, 0.09), gearM, headLen * 0.72);
  const rags = v.rag ?? 0;
  for (let i = 0; i < rags; i++) fit(b.sp2, cap(0.03, 0.12 + (i % 3) * 0.05), gearM, -(0.18 + i * 0.09));
  const mats: T.MeshStandardMaterial[] = [];
  // clone materials PER INSTANCE (SkeletonUtils shares refs), so a hit-flash never lights
  // up every zombie at once. Body materials get the variant tint; cloth is skipped.
  group.traverse(o => { const m = o as T.Mesh; if (m.isMesh) { const src = m.material as T.Material | T.Material[]; const cl = (Array.isArray(src) ? src : [src]).map(x => x.clone()); m.material = (Array.isArray(src) ? cl : cl[0]) as T.Material | T.Material[]; cl.forEach(x => { const sm = x as T.MeshStandardMaterial; if (sm && sm.isMeshStandardMaterial) { if (m.userData.noflash) return; sm.color.setHex(v.skin); if (!mats.includes(sm)) mats.push(sm); } }); m.castShadow = true; if (!m.userData.zone) m.userData.zone = 'body'; } });
  const mixer = new T.AnimationMixer(inner); const acts: Record<string, T.AnimationAction> = {};
  for (const c of clips) acts[clipKey(c.name)] = mixer.clipAction(c, inner);
  const atk = acts.attack, dd = acts.death;
  return { group, mixer, acts, head: holder.o ?? inner, headEnd: holder.end, headLen, mats, cur: null, atkRate: atk ? atk.getClip().duration / 0.55 : 1, deathDur: dd ? dd.getClip().duration : 0.5 };
}
export function glbPlay(g: GlbRig, n: string, rate = 1) { const a = g.acts[n]; if (!a) return; if (g.cur === n) { a.setEffectiveTimeScale(rate); return; } const o = g.cur ? g.acts[g.cur] : null; if (o) o.fadeOut(0.15); g.cur = n; a.reset(); a.setEffectiveTimeScale(rate); a.setLoop(n === 'walk' ? T.LoopRepeat : T.LoopOnce, Infinity); a.clampWhenFinished = n !== 'walk'; a.fadeIn(0.15).play(); }
