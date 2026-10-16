import * as T from 'three';
// Pre-load safety net ONLY. The GLB variant rig is the real enemy; this compact
// procedural rig exists so an enemy never renders as an empty group before
// preloadZombie() resolves (and so headless tests have a deterministic mesh).
// It exposes the same joint pivots + zone tags the animation code expects.
const CY = (rt: number, rb: number, h: number, s = 12) => new T.CylinderGeometry(rt, rb, h, s);
const SP = (r: number, s = 14) => new T.SphereGeometry(r, s, Math.max(8, s - 2));
const B = (w: number, h: number, d: number) => new T.BoxGeometry(w, h, d);
interface ZOpt { skin: T.Material; cloth: T.Material; wound: T.Material; bulk: number; v: number; prop: number }
function add(p: T.Object3D, geo: T.BufferGeometry, mat: T.Material, x: number, y: number, z: number, zone: string) { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.userData.zone = zone; p.add(m); return m; }
function rig(o: ZOpt) {
  const g = new T.Group(); const b = o.bulk; const sm = o.skin, cm = o.cloth, wm = o.wound;
  add(g, CY(0.21 * b, 0.19 * b, 0.3, 12), cm, 0, 0.75, 0, 'body');
  add(g, B(0.34, 0.1, 0.06), cm, 0.05, 0.82, 0.2, 'body');
  const torso = new T.Group(); torso.position.y = 0.9; g.add(torso);
  add(torso, CY(0.26 * b, 0.2 * b, 0.62, 14), sm, 0, 0.32, 0, 'body');
  add(torso, SP(0.24 * b, 14), sm, 0, 0.6, 0, 'body').scale.set(1, 0.6, 0.8);
  add(torso, B(0.2, 0.16, 0.04), wm, 0.03, 0.4, 0.2, 'body');
  for (let i = 0; i < 3; i++) { const rib = add(torso, B(0.26, 0.022, 0.02), wm, 0.02, 0.42 - i * 0.06, 0.19, 'body'); rib.rotation.z = 0.06; }
  if (b >= 1.5) { const hump = add(torso, SP(0.3 * b, 12), cm, 0, 0.66, -0.18, 'body'); hump.scale.set(1, 0.7, 0.7); const belly = add(torso, SP(0.26 * b, 12), cm, 0, 0.12, 0.1, 'body'); belly.scale.set(1, 0.8, 0.8); }
  for (const s of [-1, 1]) { const sh = add(torso, SP(0.11, 10), sm, s * 0.3 * b, 0.58, 0, 'arm'); sh.scale.set(1, 0.8, 1); }
  const mkArm = (s: number) => { const a = new T.Group(); a.position.set(s * 0.32 * b, 0.55, 0); torso.add(a); add(a, CY(0.075, 0.065, 0.42, 10), sm, 0, -0.23, 0, 'arm'); add(a, SP(0.08, 10), cm, s * 0.02, -0.03, 0, 'arm').scale.set(1, 0.7, 1); const e = new T.Group(); e.position.y = -0.46; a.add(e); e.userData.zone = 'arm'; add(e, CY(0.06, 0.05, 0.4, 10), sm, 0, -0.2, 0, 'arm'); add(e, SP(0.055, 10), sm, 0, -0.42, 0, 'arm'); const cl = add(e, CY(0.065, 0.065, 0.12, 10), cm, 0, -0.3, 0, 'arm'); cl.scale.z = 1.2; return { a, e }; };
  const L = mkArm(-1), R = mkArm(1); const armL = L.a, elbL = L.e, armR = R.a, elbR = R.e;
  const mkLeg = (s: number) => { const l = new T.Group(); l.position.set(s * 0.13, 0.62, 0); g.add(l); add(l, CY(0.1, 0.085, 0.44, 10), cm, 0, -0.22, 0, 'leg'); const k = new T.Group(); k.position.y = -0.46; l.add(k); k.userData.zone = 'leg'; add(k, CY(0.075, 0.06, 0.42, 10), sm, 0, -0.21, 0, 'leg'); add(k, CY(0.085, 0.085, 0.14, 10), cm, 0, -0.12, 0, 'leg'); add(k, SP(0.09, 10), cm, s * 0.02, -0.44, 0.05, 'leg').scale.set(1, 0.6, 1.3); return { l, k }; };
  const LL = mkLeg(-1), RL = mkLeg(1); const legL = LL.l, knL = LL.k, legR = RL.l, knR = RL.k;
  const head = new T.Group(); head.position.y = 0.72; torso.add(head);
  add(head, SP(0.16, 14), sm, 0, 0.1, 0, 'head');
  add(head, B(0.2, 0.07, 0.1), sm, 0, 0.02, 0.1, 'head');
  add(head, B(0.18, 0.025, 0.02), new T.MeshStandardMaterial({ color: 0xcfc39a, roughness: 0.7 }), 0, -0.01, 0.15, 'head');
  add(head, B(0.2, 0.05, 0.05), sm, 0, 0.18, 0.12, 'head');
  const eg = new T.MeshBasicMaterial({ color: 0xff7733 }); add(head, SP(0.03, 8), eg, -0.06, 0.1, 0.13, 'head'); add(head, SP(0.03, 8), eg, 0.06, 0.1, 0.13, 'head');
  const jaw = new T.Group(); head.add(jaw);
  if (o.prop === 0) add(head, CY(0.02, 0.02, 0.24, 6), cm, 0, 0.3, -0.05, 'head').rotation.x = 1.2;
  else if (o.prop === 1) add(head, B(0.1, 0.06, 0.02), wm, 0.08, 0.16, 0.1, 'head').rotation.z = 0.4;
  else add(torso, CY(0.16, 0.2, 0.1, 10), cm, -0.1, 0.5, 0.14, 'body');
  const dg = o.v * 0.15; armL.rotation.set(-0.5 - dg, 0, 0.22); armR.rotation.set(-0.25 - dg, 0, -0.3);
  elbL.rotation.x = -0.35; elbR.rotation.x = -0.45;
  const sway: { o: T.Group; ph: number }[] = [];
  const strip = (p: T.Object3D, x: number, y: number, w: number, l: number, ph: number) => { const s = new T.Group(); s.position.set(x, y, 0); p.add(s); add(s, B(w, l, 0.02), cm, 0, -l / 2, 0.01, 'body'); sway.push({ o: s, ph }); };
  strip(torso, -0.16 * b, 0.04, 0.08, 0.28, o.v); strip(torso, 0.14 * b, 0.04, 0.06, 0.22, o.v + 2);
  strip(elbL, -0.04, -0.08, 0.05, 0.18, o.v + 4); strip(elbR, 0.05, -0.08, 0.05, 0.16, o.v + 5);
  g.rotation.y = Math.PI; g.userData = { armL, armR, legL, legR, head, torso, jaw, elbL, elbR, knL, knR, sway };
  return g;
}
function finish(g: T.Group, h = 1.75) { g.scale.setScalar(h / 1.75); return g; }
const PAL: Record<string, [number, number, number, number]> = {
  drifter: [0x9db38a, 0x5a6b72, 0x8e2f2f, 1], rusher: [0xb0a06a, 0x6e3a2e, 0x9e2f2f, 0.9],
  brute: [0x7d9b6e, 0x4a4a52, 0x7e2a2a, 1.7], runner: [0xc2b48a, 0x3e5a6e, 0x9e2f2f, 0.85],
  crusher: [0x6e8b5e, 0x3a3a42, 0x6e2222, 1.9], stalker: [0x8aa392, 0x2e2e36, 0x9e2f2f, 1],
};
export function fallbackZombie(kind: string, v: number) { const p = PAL[kind] ?? PAL.drifter; return finish(rig({ skin: new T.MeshStandardMaterial({ color: p[0], roughness: 0.6 }), cloth: new T.MeshStandardMaterial({ color: p[1], roughness: 0.9 }), wound: new T.MeshStandardMaterial({ color: p[2], roughness: 0.5 }), bulk: p[3], v, prop: v % 3 })); }
