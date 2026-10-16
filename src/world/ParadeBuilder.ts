import * as T from 'three';import { CW } from '../core/CollisionWorld';import { M } from '../assets/materials';import { banner } from '../assets/textureFactory';import { crate, ammoCrate, car, barrier, streetlamp } from '../assets/environmentModels';
// DAYLIGHT diorama palette (parade-local; street keeps its night kit).
const sand=new T.MeshStandardMaterial({color:0xd6c9a3,roughness:0.95});
const slabM=new T.MeshStandardMaterial({color:0xe4d9b6,roughness:0.95});
const facade=new T.MeshStandardMaterial({color:0x9a938a,roughness:0.9});
const roofM=new T.MeshStandardMaterial({color:0x5a6b62,roughness:0.85});
const trimM=new T.MeshStandardMaterial({color:0xe8e4d8,roughness:0.9});
const glassM=new T.MeshStandardMaterial({color:0x2e5a7a,roughness:0.3,metalness:0.4});
const bronze=new T.MeshLambertMaterial({color:0x4a3a26});
const domeM=new T.MeshStandardMaterial({color:0x6a7f8a,roughness:0.6});
// Flanking block: warm facade, gray-green roof slab with overhang, dark
// window insets on the avenue face. Footprint w(x) x d(z), height h.
function block(w:number,h:number,d:number,sx:number){const b=new T.Group();
const f=new T.Mesh(new T.BoxGeometry(w,h,d),facade);f.position.y=h/2;b.add(f);
const r=new T.Mesh(new T.BoxGeometry(w+1,0.7,d+1),roofM);r.position.y=h+0.35;b.add(r);
const winM=new T.MeshBasicMaterial({color:0x2b3438});
for(let yy=2.5;yy<h-1;yy+=3)for(let zz=-d/2+2;zz<=d/2-2;zz+=3){const win=new T.Mesh(new T.PlaneGeometry(1.4,1.8),winM);win.position.set(-sx*(w/2+0.02),yy,zz);win.rotation.y=sx<0?Math.PI/2:-Math.PI/2;b.add(win);}
return b;}
// PARADE AVENUE: monumental symmetric boulevard. Axis along z; player
// enters near +z, assembly hall closes the far -z end. All colliders
// registered via solid() from the same transform as the mesh —
// no invisible walls. Everything axis-aligned.
export interface SolidRec{x:number;z:number;w:number;d:number}
function sign(text:string){const mat=(t?:T.Texture)=>new T.MeshBasicMaterial({...(t?{map:t}:{color:0xe8ece7}),side:T.DoubleSide});if(typeof document==='undefined')return new T.Mesh(new T.PlaneGeometry(3,0.56),mat());const c=document.createElement('canvas');c.width=256;c.height=48;const g=c.getContext('2d')!;g.fillStyle='#11191B';g.fillRect(0,0,256,48);g.fillStyle='#E8ECE7';g.font='bold 24px monospace';g.textAlign='center';g.fillText(text,128,33);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return new T.Mesh(new T.PlaneGeometry(3,0.56),mat(t));}
export function parade(){const g=new T.Group();const cw=new CW();
const walls:T.Object3D[]=[];const solids:SolidRec[]=[];
const col=(x:number,z:number,w:number,d:number)=>{cw.add({minX:x-w/2,minZ:z-d/2,maxX:x+w/2,maxZ:z+d/2});solids.push({x,z,w,d});};
const solid=(o:T.Object3D,x:number,z:number,w:number,d:number)=>{o.position.x=x;o.position.z=z;g.add(o);walls.push(o);col(x,z,w,d);return o;};
const banM=new T.MeshBasicMaterial({map:banner(),side:T.DoubleSide});
// ground: sandstone base + pale avenue slab + side paving + white ticks
const base=new T.Mesh(new T.BoxGeometry(80,0.2,100),sand);base.position.set(0,-0.11,0);g.add(base);
const slab=new T.Mesh(new T.BoxGeometry(16,0.08,92),slabM);slab.position.set(0,0,-1);g.add(slab);
for(const sx of [-1,1]){const pave=new T.Mesh(new T.BoxGeometry(14,0.08,92),sand);pave.position.set(sx*15,0,-1);g.add(pave);}
const tickM=new T.MeshBasicMaterial({color:0xf2eee2});
for(let z=-44;z<=42;z+=6){for(const x of [-7.5,7.5]){const t=new T.Mesh(new T.BoxGeometry(0.3,0.09,2),tickM);t.position.set(x,0.045,z);g.add(t);}}
for(let z=-36;z<=36;z+=12){const t=new T.Mesh(new T.BoxGeometry(14,0.09,0.4),tickM);t.position.set(0,0.045,z);g.add(t);}
// flanking blocks with facade banners (faces toward avenue)
const hs=[13,10,15,11];
for(const sx of [-1,1]){let hi=sx<0?0:2;for(const z of [-28,-12,4,20]){const b=block(18,hs[hi++%4],12,sx);solid(b,sx*27,z,18,12);
for(const dz of [-3.5,3.5]){const bn=new T.Mesh(new T.PlaneGeometry(3,6),banM);bn.position.set(sx*17.8,5,z+dz);bn.rotation.y=sx<0?Math.PI/2:-Math.PI/2;g.add(bn);}}}
// banner poles lining the avenue (thin collider at base)
for(const sx of [-1,1])for(let z=-36;z<=36;z+=12){const p=new T.Group();const pole=new T.Mesh(new T.CylinderGeometry(0.07,0.09,4.4,8),M.steelD);pole.position.y=2.2;p.add(pole);const pen=new T.Mesh(new T.PlaneGeometry(0.9,1.6),banM);pen.position.set(0.5,3.5,0);p.add(pen);p.position.set(sx*10.5,0,z);g.add(p);col(sx*10.5,z,0.3,0.3);}
// monument court: pedestal + dark statue (cover), planter ring
const ped=new T.Group();const pb=new T.Mesh(new T.BoxGeometry(2.4,1.6,2.4),trimM);pb.position.y=0.8;ped.add(pb);
const torsoS=new T.Mesh(new T.CylinderGeometry(0.5,0.7,2.2,8),bronze);torsoS.position.y=2.7;ped.add(torsoS);
const headS=new T.Mesh(new T.SphereGeometry(0.42,10,8),bronze);headS.position.y=4.1;ped.add(headS);
const armS=new T.Mesh(new T.BoxGeometry(2.2,0.35,0.35),bronze);armS.position.y=3.4;ped.add(armS);solid(ped,0,0,2.6,2.6);
for(const [x,z] of [[-7,-7],[7,-7],[-7,7],[7,7]] as const){const pl=new T.Mesh(new T.BoxGeometry(1.6,1.0,1.6),sand);pl.position.y=0.5;solid(pl,x,z,1.6,1.6);}
// terrace + steps + assembly hall (far -z end)
const terr=new T.Mesh(new T.BoxGeometry(44,1.0,10),slabM);terr.position.set(0,0.5,-41);g.add(terr);col(0,-41,44,10);
for(let i=0;i<3;i++){const st=new T.Mesh(new T.BoxGeometry(20-i*4,0.34,1.1),sand);st.position.set(0,0.17+i*0.33,-35.4-i*1.05);g.add(st);}
const hall=new T.Group();const hb=new T.Mesh(new T.BoxGeometry(44,13,8),facade);hb.position.y=6.5;hall.add(hb);
const dome=new T.Mesh(new T.SphereGeometry(7,16,10,0,Math.PI*2,0,Math.PI/2),domeM);dome.position.y=13;hall.add(dome);
const glassRow=new T.Mesh(new T.BoxGeometry(30,2.2,0.2),glassM);glassRow.position.set(0,9.5,4.05);hall.add(glassRow);
for(let i=-2;i<=2;i++){const c=new T.Mesh(new T.CylinderGeometry(0.7,0.8,10,10),trimM);c.position.set(i*7,5,4.2);hall.add(c);}
const big=new T.Mesh(new T.PlaneGeometry(5,10),banM);big.position.set(0,6,4.15);hall.add(big);solid(hall,0,-46,44,8);
// near gate wall + pillars behind player
for(const x of [-10,0,10])solid(new T.Mesh(new T.BoxGeometry(8,1.4,0.6),trimM),x,45,8,0.6);
for(const x of [-15,15])solid(new T.Mesh(new T.BoxGeometry(1.4,3.4,1.4),trimM),x,45,1.4,1.4);
const s0=sign('PARADE AVENUE');s0.position.set(0,4.2,44.6);s0.rotation.y=Math.PI;g.add(s0);
// side bounds: low fences (visible, colliders)
for(const sx of [-1,1])for(const z of [-24,-8,8,24])solid(new T.Mesh(new T.BoxGeometry(0.5,1.2,14),facade),sx*37,z,0.5,14);
// wrecked cars + barrier cover on the avenue
const cars:[number,number][]=[[4.5,-14],[-4.5,14]];
cars.forEach(([x,z],i)=>{const m=car([0x6e2e2e,0x2e4a6e][i%2]);solid(m,x,z,2.0,4.4);});
for(const [x,z] of [[-4,22],[4,22],[-5,-24],[5,-24]] as const){const b=barrier();solid(b,x,z,2,0.5);}
for(const [x,z] of [[-20,28],[20,-28]] as const){const c=crate(1.5);solid(c,x,z,1.5,1.5);}
// lamp rows, daytime: unlit geometry with thin base colliders
const lamps:T.Group[]=[];const lit=new Set<string>([]);const lampPts:[number,number][]=[[-12,30],[12,30],[-12,6],[12,-6],[-12,-18],[12,-18],[-12,-30],[12,6]];
for(const [x,z] of lampPts){const l=streetlamp(lit.has(x+','+z));if(x>0)l.rotation.y=Math.PI;l.position.y=0;l.position.x=x;l.position.z=z;g.add(l);lamps.push(l);col(x,z,0.35,0.35);}
// ammo crates: court flanks + terrace foot
const cratePts=[{x:-4.5,z:5},{x:4.5,z:-5},{x:0,z:-33}];const crateMeshes:T.Group[]=[];
for(const p of cratePts){const ac=ammoCrate();ac.position.set(p.x,0,p.z);g.add(ac);walls.push(ac);col(p.x,p.z,1.3,0.9);crateMeshes.push(ac);}
g.add(new T.HemisphereLight(0x9fb8d0,0x6b6250,0.75));const sun=new T.DirectionalLight(0xffe6c2,2.0);sun.position.set(18,30,10);g.add(sun);
const spawns=[{x:-30,z:-40},{x:30,z:-40},{x:-34,z:12},{x:34,z:12},{x:-34,z:-20},{x:34,z:-20},{x:-14,z:-2},{x:14,z:2}];
return{group:g,cw,walls,spawns,player0:{x:0,z:38},lamps,crates:cratePts,crateMeshes,fogColor:0xd8cfc0,fogNear:45,fogFar:130,solids,nav:{x0:-40,z0:-50,nx:80,nz:100}};}
