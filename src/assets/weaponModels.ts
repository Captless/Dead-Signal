import * as T from 'three';import { M } from './materials';
const add=(g:T.Group,geo:T.BufferGeometry,m:T.Material,x:number,y:number,z:number)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o;};
const tag=(o:T.Mesh)=>{o.userData.base=o.position.clone();return o;};
const BX=(w:number,h:number,d:number)=>new T.BoxGeometry(w,h,d);
const poly=new T.MeshLambertMaterial({color:0x1c1f21});const met=new T.MeshLambertMaterial({color:0x33383b});const gripM=new T.MeshLambertMaterial({color:0x24282a});
// stencil marking plate, node-safe
function plate(g:T.Group,txt:string,w:number,x:number,y:number,z:number){if(typeof document==='undefined')return;const c=document.createElement('canvas');c.width=128;c.height=32;const q=c.getContext('2d')!;q.fillStyle='#c8c2b4';q.font='700 20px monospace';q.fillText(txt,8,23);const t=new T.CanvasTexture(c);const o=new T.Mesh(new T.PlaneGeometry(w,0.016),new T.MeshBasicMaterial({map:t,transparent:true}));o.position.set(x,y,z);g.add(o);}
// picatinny rail strip with notches
function rail(g:T.Group,x:number,y:number,z:number,len:number){add(g,BX(0.055,0.012,len),met,x,y,z);const n=Math.floor(len/0.035);for(let i=0;i<n;i++)add(g,BX(0.06,0.012,0.012),met,x,y+0.008,z-len/2+0.02+i*0.035);}
function sightSet(g:T.Group,rearBase:number,frontBase:number,fz:number,rz:number){add(g,BX(0.012,0.035,0.012),met,-0.02,frontBase+0.0175,fz);add(g,BX(0.012,0.035,0.012),met,0.02,frontBase+0.0175,fz);add(g,BX(0.05,0.03,0.012),met,0,rearBase+0.015,rz);add(g,BX(0.014,0.014,0.014),M.amber,0,frontBase+0.0175,fz);}
function muzzle(g:T.Group,x:number,y:number,z:number){const mz=add(g,BX(0.09,0.09,0.03),M.amber,x,y,z);mz.visible=false;g.userData.muzzle=mz;}
const brake=(g:T.Group,z:number)=>{add(g,BX(0.045,0.045,0.07),met,0,0.02,z);for(let i=0;i<2;i++)add(g,BX(0.05,0.015,0.02),poly,0,0.02,z-0.02+i*0.04);};
// tactical pistol: railed frame, serrated slide, threaded barrel, DS-9 plate
export function pistol(){const g=new T.Group();
add(g,BX(0.055,0.06,0.2),poly,0,-0.01,0.02);add(g,BX(0.05,0.02,0.12),met,0,-0.045,-0.1);
const slide=tag(add(g,BX(0.052,0.05,0.27),met,0,0.04,-0.02));g.userData.slide=slide;
for(let i=0;i<3;i++)add(g,BX(0.056,0.04,0.012),poly,0,0.04,0.06+i*0.025);
add(g,new T.CylinderGeometry(0.011,0.011,0.05,8),met,0,0.04,-0.17).rotation.x=Math.PI/2;
add(g,BX(0.052,0.13,0.07),gripM,0,-0.1,0.06).rotation.x=0.2;
for(let i=0;i<3;i++)add(g,BX(0.054,0.012,0.05),poly,0,-0.13+i*0.03,0.075-i*0.006);
add(g,BX(0.018,0.05,0.025),met,0,-0.05,-0.02);
sightSet(g,0.065,0.051,-0.17,0.08);
plate(g,'DS-9',0.05,-0.0285,0.04,-0.02);
muzzle(g,0,0.04,-0.2);g.position.set(0.22,-0.2,-0.45);return g;}
// tactical shotgun: brake, ghost ring, ribbed pump, saddle shells, stock+pad
export function shotgun(){const g=new T.Group();
add(g,BX(0.07,0.08,0.3),poly,0,0.0,-0.02);add(g,BX(0.06,0.06,0.3),met,0,0.0,-0.05);
add(g,BX(0.055,0.055,0.4),met,0,0.03,-0.25);add(g,BX(0.045,0.045,0.36),poly,0,-0.045,-0.24);brake(g,-0.47);
const pump=tag(add(g,BX(0.09,0.085,0.15),gripM,0,-0.045,-0.28));g.userData.pump=pump;
for(let i=0;i<4;i++)add(g,BX(0.095,0.06,0.014),poly,0,-0.045,-0.33+i*0.035);
add(g,BX(0.05,0.045,0.014),met,0,0.0625,-0.1);add(g,BX(0.06,0.012,0.012),met,0,0.0625,-0.1);add(g,BX(0.014,0.03,0.014),M.amber,0,0.0725,-0.42);
for(let i=0;i<4;i++){const s=add(g,new T.CylinderGeometry(0.011,0.011,0.05,8),M.amber,0.045,0.0,-0.12+i*0.055);s.rotation.x=Math.PI/2;}
add(g,BX(0.055,0.12,0.07),gripM,0,-0.09,0.1).rotation.x=0.15;
add(g,BX(0.06,0.12,0.24),poly,0,-0.07,0.28);add(g,BX(0.065,0.13,0.03),gripM,0,-0.07,0.4);
plate(g,'K8-BREACHER',0.07,0.0375,0.0,-0.02);
muzzle(g,0,0.03,-0.52);g.position.set(0.22,-0.2,-0.45);return g;}
// tactical smg: railed receiver, suppressor, folding sights, stick mag, wire stock, foregrip
export function smg(){const g=new T.Group();
add(g,BX(0.065,0.1,0.32),poly,0,0.0,-0.04);rail(g,0,0.062,-0.04,0.3);
add(g,BX(0.045,0.045,0.12),met,0,0.0,-0.24);add(g,new T.CylinderGeometry(0.028,0.028,0.16,10),poly,0,0.0,-0.36).rotation.x=Math.PI/2;
const mag=tag(add(g,BX(0.05,0.2,0.06),gripM,0,-0.14,-0.02));mag.rotation.x=0.08;g.userData.mag=mag;
add(g,BX(0.05,0.1,0.06),gripM,0,-0.08,0.1).rotation.x=0.2;
const bolt=tag(add(g,BX(0.025,0.03,0.05),met,0.045,0.02,0.04));g.userData.bolt=bolt;
add(g,BX(0.035,0.09,0.05),gripM,0,-0.06,-0.16).rotation.x=-0.15;
add(g,new T.CylinderGeometry(0.008,0.008,0.14,6),met,-0.02,-0.03,0.2).rotation.x=Math.PI/2;add(g,new T.CylinderGeometry(0.008,0.008,0.14,6),met,0.02,-0.03,0.2).rotation.x=Math.PI/2;add(g,BX(0.055,0.1,0.03),gripM,0,-0.03,0.27);
add(g,BX(0.04,0.04,0.014),poly,-0.015,0.088,-0.16);add(g,BX(0.04,0.04,0.014),poly,0.015,0.088,-0.16);
plate(g,'VK-9',0.045,-0.034,0.0,-0.04);
muzzle(g,0,0.0,-0.46);g.position.set(0.22,-0.2,-0.45);return g;}
// tactical rifle: handguard vents+rail, carry handle, curved mag, charging handle, brake, foregrip
export function rifle(){const g=new T.Group();
add(g,BX(0.045,0.045,0.24),met,0,0.02,-0.4);brake(g,-0.53);
add(g,BX(0.068,0.08,0.3),poly,0,0.0,-0.16);
for(let i=0;i<3;i++){add(g,BX(0.072,0.02,0.05),poly,-0.0,0.02,-0.25+i*0.09);add(g,BX(0.072,0.02,0.05),poly,0,-0.02,-0.25+i*0.09);}
rail(g,0,0.052,-0.16,0.28);
add(g,BX(0.06,0.05,0.22),met,0,0.065,-0.08);add(g,BX(0.05,0.02,0.12),met,0,0.10,-0.08);add(g,BX(0.014,0.032,0.014),M.amber,0,0.0585,-0.5);
add(g,BX(0.065,0.07,0.16),met,0,-0.01,0.08);
const mag=tag(add(g,BX(0.052,0.17,0.075),gripM,0,-0.12,0.02));mag.rotation.x=0.4;g.userData.mag=mag;
const ch=tag(add(g,BX(0.06,0.025,0.04),met,0,0.045,0.17));g.userData.ch=ch;
add(g,BX(0.05,0.1,0.06),gripM,0,-0.075,0.14).rotation.x=0.2;
add(g,BX(0.035,0.09,0.05),gripM,0,-0.055,-0.2).rotation.x=-0.15;
add(g,BX(0.055,0.11,0.2),poly,0,-0.05,0.28);add(g,BX(0.06,0.05,0.06),gripM,0,-0.03,0.36);
plate(g,'PR-15',0.05,0.0345,-0.01,0.08);
muzzle(g,0,0.02,-0.58);g.position.set(0.22,-0.2,-0.45);return g;}
// heavy pistol: long slide, compensator cuts, extended barrel, big grip, HVY-45 plate
export function heavy(){const g=new T.Group();
add(g,BX(0.06,0.065,0.24),poly,0,-0.01,0.02);add(g,BX(0.055,0.02,0.14),met,0,-0.05,-0.1);
const slide=tag(add(g,BX(0.058,0.055,0.32),met,0,0.045,-0.03));g.userData.slide=slide;
for(let i=0;i<4;i++)add(g,BX(0.062,0.045,0.014),poly,0,0.045,0.07+i*0.025);
add(g,new T.CylinderGeometry(0.013,0.013,0.07,8),met,0,0.045,-0.21).rotation.x=Math.PI/2;
add(g,BX(0.06,0.045,0.06),poly,0,0.045,-0.2);
add(g,BX(0.058,0.15,0.075),gripM,0,-0.105,0.06).rotation.x=0.2;
for(let i=0;i<3;i++)add(g,BX(0.06,0.012,0.055),poly,0,-0.14+i*0.035,0.078-i*0.007);
add(g,BX(0.02,0.05,0.028),met,0,-0.055,-0.02);
sightSet(g,0.0725,0.0585,-0.21,0.09);
plate(g,'HVY-45',0.055,-0.031,0.045,-0.03);
muzzle(g,0,0.045,-0.26);g.position.set(0.22,-0.2,-0.45);return g;}
// rapid smg: short shroud, top rail, fat twin mag, side bolt, wire stock
export function rapid(){const g=new T.Group();
add(g,BX(0.07,0.1,0.28),poly,0,0.0,-0.02);rail(g,0,0.062,-0.02,0.26);
add(g,BX(0.05,0.05,0.14),met,0,0.0,-0.2);add(g,BX(0.06,0.06,0.08),poly,0,0.0,-0.26);
const mag=tag(add(g,BX(0.06,0.22,0.07),gripM,0,-0.15,-0.0));mag.rotation.x=0.06;g.userData.mag=mag;
add(g,BX(0.05,0.1,0.06),gripM,0,-0.08,0.1).rotation.x=0.2;
const bolt=tag(add(g,BX(0.025,0.03,0.05),met,0.048,0.02,0.06));g.userData.bolt=bolt;
add(g,BX(0.035,0.08,0.05),gripM,0,-0.06,-0.15).rotation.x=-0.15;
add(g,new T.CylinderGeometry(0.008,0.008,0.13,6),met,-0.02,-0.03,0.19).rotation.x=Math.PI/2;add(g,new T.CylinderGeometry(0.008,0.008,0.13,6),met,0.02,-0.03,0.19).rotation.x=Math.PI/2;add(g,BX(0.055,0.09,0.03),gripM,0,-0.03,0.26);
add(g,BX(0.04,0.035,0.014),poly,-0.015,0.088,-0.12);add(g,BX(0.04,0.035,0.014),poly,0.015,0.088,-0.12);
plate(g,'RPD-40',0.045,-0.0365,0.0,-0.02);
muzzle(g,0,0.0,-0.32);g.position.set(0.22,-0.2,-0.45);return g;}
// marksman rifle: long barrel, scope tube+rings, slim handguard, charging handle
export function marksman(){const g=new T.Group();
add(g,BX(0.04,0.04,0.4),met,0,0.02,-0.5);brake(g,-0.72);
add(g,BX(0.064,0.075,0.3),poly,0,0.0,-0.14);rail(g,0,0.05,-0.14,0.26);
add(g,BX(0.035,0.035,0.2),met,0,0.085,-0.12);add(g,BX(0.028,0.028,0.05),poly,0,0.085,-0.02);add(g,BX(0.028,0.028,0.05),poly,0,0.085,-0.22);
add(g,BX(0.014,0.014,0.1),met,0,0.062,-0.12);
add(g,BX(0.065,0.07,0.16),met,0,-0.01,0.08);
const mag=tag(add(g,BX(0.05,0.15,0.07),gripM,0,-0.11,0.03));mag.rotation.x=0.3;g.userData.mag=mag;
const ch=tag(add(g,BX(0.06,0.025,0.04),met,0,0.045,0.17));g.userData.ch=ch;
add(g,BX(0.05,0.1,0.06),gripM,0,-0.075,0.14).rotation.x=0.2;
add(g,BX(0.035,0.09,0.05),gripM,0,-0.055,-0.18).rotation.x=-0.15;
add(g,BX(0.055,0.11,0.2),poly,0,-0.05,0.28);add(g,BX(0.06,0.05,0.06),gripM,0,-0.03,0.36);
plate(g,'MK-12',0.045,0.0345,-0.01,0.08);
muzzle(g,0,0.02,-0.77);g.position.set(0.22,-0.2,-0.45);return g;}
// lmg: fat receiver, ammo box, heavy barrel, top rail, side bolt
export function lmg(){const g=new T.Group();
add(g,BX(0.05,0.05,0.3),met,0,0.02,-0.5);add(g,BX(0.055,0.055,0.09),met,0,0.02,-0.66);
add(g,BX(0.085,0.1,0.34),poly,0,0.0,-0.14);rail(g,0,0.062,-0.14,0.3);
add(g,BX(0.07,0.06,0.2),met,0,0.075,-0.1);
const mag=tag(add(g,BX(0.11,0.13,0.14),gripM,0,-0.1,-0.02));g.userData.mag=mag;
const bolt=tag(add(g,BX(0.03,0.035,0.06),met,0.058,0.02,0.02));g.userData.bolt=bolt;
add(g,BX(0.055,0.11,0.065),gripM,0,-0.085,0.12).rotation.x=0.2;
add(g,BX(0.06,0.12,0.22),poly,0,-0.06,0.3);add(g,BX(0.065,0.06,0.06),gripM,0,-0.04,0.4);
plate(g,'MG-100',0.05,-0.044,0.0,-0.14);
muzzle(g,0,0.02,-0.72);g.position.set(0.22,-0.2,-0.45);return g;}
