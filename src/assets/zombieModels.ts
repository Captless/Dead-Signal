import * as T from 'three';import { M } from './materials';import { skin as skinTx, cloth as clothTx } from './textureFactory';
const SKIN_TINT=[0x9aa184,0x8a9378,0xa89a80];const CLOTH_TINT=[0x5a6a72,0x6a6258,0x4a5a66];
const SKIN_M=new Map<number,T.Material>(),CLOTH_M=new Map<number,T.Material>();
function skinMat(v:number){let m=SKIN_M.get(v);if(!m){m=new T.MeshStandardMaterial({map:skinTx(),color:SKIN_TINT[v%3],roughness:0.85});SKIN_M.set(v,m);}return m;}
function clothMat(v:number){let m=CLOTH_M.get(v);if(!m){m=new T.MeshStandardMaterial({map:clothTx(),color:CLOTH_TINT[v%3],roughness:0.95});CLOTH_M.set(v,m);}return m;}
const WM=new T.MeshStandardMaterial({color:0x6e2019,roughness:0.6});
const VEST=new T.MeshStandardMaterial({color:0x2e6a62,roughness:0.8});
function woundMat(){return WM;}
// Articulated rig with two-segment limbs. userData: pivots + {zone} tags.
const GEO=new Map<string,T.BoxGeometry>();
function rig(o:{bulk:number;lean:number;skin:T.Material;cloth:T.Material;face:number;prop:number;v:number;pal:number;eye:number}):T.Group{
const g=new T.Group();const B=(w:number,h:number,d:number)=>{const k=w.toFixed(2)+','+h.toFixed(2)+','+d.toFixed(2);let x=GEO.get(k);if(!x){x=new T.BoxGeometry(w,h,d);GEO.set(k,x);}return x;};
const add=(p:T.Object3D,geo:T.BufferGeometry,m:T.Material,x:number,y:number,z:number,zone='body')=>{const q=new T.Mesh(geo,m);q.position.set(x,y,z);q.userData.zone=zone;p.add(q);return q;};
const b=o.bulk,wm=woundMat(),cm=clothMat(o.pal);
add(g,B(0.34*b,0.5,0.24),cm,0,0.5,0,'leg'); // pelvis
add(g,B(0.36*b,0.1,0.26),M.steelD,0,0.72,0); // belt strap
const legL=new T.Group();legL.position.set(-0.13*b,0.75,0);g.add(legL);
const legR=new T.Group();legR.position.set(0.13*b,0.75,0);g.add(legR);
add(legL,B(0.17,0.45,0.2),cm,0,-0.22,0,'leg');add(legR,B(0.17,0.45,0.2),cm,0,-0.22,0.01,'leg'); // thighs
const knL=new T.Group();knL.position.set(0,-0.45,0);legL.add(knL);
const knR=new T.Group();knR.position.set(0,-0.45,0.01);legR.add(knR);
add(knL,B(0.15,0.42,0.18),o.skin,0,-0.2,0,'leg');add(knR,B(0.15,0.42,0.18),o.skin,0,-0.2,0,'leg'); // shins
add(knL,B(0.19,0.12,0.3),o.skin,0,-0.42,0.04,'leg');add(knR,B(0.19,0.12,0.3),o.skin,0,-0.42,0.04,'leg'); // boots
add(knR,B(0.1,0.22,0.05),wm,0.06,-0.18,0.09,'leg'); // leg gash
const torso=new T.Group();torso.position.set(0,0.75,0);g.add(torso);
add(torso,B(0.6*b,0.7,0.34),cm,0,0.35,0); // chest
add(torso,B(0.16,0.2,0.03),wm,(o.v%2?0.14:-0.14),0.4,0.17); // chest wound
add(torso,B(0.5*b,0.12,0.3),o.skin,0,0.02,0.01,'body'); // torn shirt hem (skin shows)
if(o.prop===1)add(torso,B(0.64*b,0.18,0.38),VEST,0,0.42,0); // vest stripe
if(o.prop===2)add(torso,B(0.4*b,0.5,0.12),M.steelD,0,0.35,-0.22); // backpack
const armL=new T.Group();armL.position.set(-0.36*b,0.62,0);torso.add(armL);
const armR=new T.Group();armR.position.set(0.36*b,0.62,0);torso.add(armR);
add(armL,B(0.15,0.3,0.17),cm,0,-0.14,0,'arm'); // left sleeve intact
add(armR,B(0.13,0.3,0.15),o.skin,0.02,-0.14,-0.02,'arm'); // right sleeve torn off
add(armR,B(0.09,0.16,0.04),wm,0.02,-0.2,0.07,'arm'); // bite wound
const elbL=new T.Group();elbL.position.set(0,-0.3,0);armL.add(elbL);
const elbR=new T.Group();elbR.position.set(0,-0.3,-0.02);armR.add(elbR);
add(elbL,B(0.13,0.32,0.15),o.skin,0,-0.15,0.02,'arm');add(elbR,B(0.12,0.3,0.14),o.skin,0.02,-0.14,0,'arm'); // forearms
add(elbL,B(0.14,0.14,0.15),o.skin,0,-0.34,0.05,'arm');add(elbR,B(0.14,0.14,0.15),o.skin,0.02,-0.33,-0.03,'arm'); // claws
const dg=o.v*0.15;armL.rotation.set(-0.5-dg,0,0.3);armR.rotation.set(-0.25-dg,0,-0.4); // reach asymmetry + dangle variance
elbL.rotation.x=-0.35;elbR.rotation.x=-0.45;
const neck=new T.Group();neck.position.set(0,0.72,0);torso.add(neck);
const head=new T.Group();head.position.set(0.04,0.14,0.02);neck.add(head);
add(head,B(0.3,0.32,0.3),o.skin,0,0.05,0,'head');
add(head,B(0.12,0.09,0.02),wm,-0.09,0.0,0.15,'head'); // cheek gash
const eyeM=new T.MeshBasicMaterial({color:o.eye}); // glowing eyes
add(head,B(0.07,0.05,0.02),eyeM,-0.07,0.1,0.15,'head');add(head,B(0.07,0.05,0.02),eyeM,0.07,0.08,0.15,'head');
add(head,B(0.22,0.03,0.03),new T.MeshStandardMaterial({color:0xcfc39a,roughness:0.7}),0,-0.02,0.14,'head'); // teeth
const jaw=new T.Group();jaw.position.set(0,-0.06,0.05);head.add(jaw);
add(jaw,B(0.2,0.08,0.12),new T.MeshStandardMaterial({color:0x2a1414,roughness:1}),0,-0.04,0.08,'head'); // jaw maw
if(o.prop===0){add(head,B(0.34,0.08,0.34),M.steelD,0,0.24,-0.02,'head');} // helmet brim
else if(o.prop===1){add(head,B(0.1,0.14,0.1),cm,-0.08,0.24,-0.04,'head');add(head,B(0.1,0.12,0.1),cm,0.09,0.23,-0.03,'head');} // messy hair tufts
else{add(head,B(0.1,0.02,0.12),wm,0.05,0.21,0.02,'head');} // scalp scar
add(head,B(0.32,0.1,0.32),cm,0,0.2,-0.02,'head'); // scalp/hair cap
head.rotation.z=0.08;neck.rotation.x=o.lean;
g.rotation.y=Math.PI;g.userData={armL,armR,legL,legR,head,torso,jaw,elbL,elbR,knL,knR};
return g;}
const R2=(v:number,pal:number,eye:number)=>({bulk:1,lean:0.12,skin:skinMat(v),cloth:clothMat(pal),face:eye,prop:v,v,pal,eye});
export function drifter(v=0){const g=rig({...R2(v,0,0xff3020),bulk:1,lean:0.12});g.scale.setScalar(0.98+v*0.03);return g;}
export function rusher(v=1){const g=rig({...R2(v,1,0xff3050),bulk:0.85,lean:0.35});g.scale.set(0.9,0.95,0.9);return g;}
export function brute(v=2){const g=rig({...R2(v,2,0xff2030),bulk:1.5,lean:0.05});g.scale.set(1.05,1.02,1.05);return g;}
export function runner(v=0){const g=rig({...R2(v,1,0x50ff70),bulk:0.75,lean:0.5});g.scale.set(0.85,0.92,0.85);return g;}
export function crusher(v=1){const g=rig({...R2(v,0,0xff2060),bulk:1.8,lean:0});g.scale.set(1.25,1.18,1.25);return g;}
export function stalker(v=2){const g=rig({...R2(v,2,0xc020ff),bulk:0.9,lean:0.28});g.scale.set(0.95,1.05,0.95);return g;}
