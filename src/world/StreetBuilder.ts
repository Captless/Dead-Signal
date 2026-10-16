import * as T from 'three';import { CW } from '../core/CollisionWorld';import { M } from '../assets/materials';import { concrete } from '../assets/textureFactory';import { crate, ammoCrate, building, car, barrier, streetlamp } from '../assets/environmentModels';
// SIGNAL PLAZA: open square arena. All colliders registered via solid()
// from the same transform as the mesh — no invisible walls. Everything
// axis-aligned so collider boxes match visuals exactly.
export interface SolidRec{x:number;z:number;w:number;d:number}
function sign(text:string){const mat=(t?:T.Texture)=>new T.MeshBasicMaterial({...(t?{map:t}:{color:0xe8ece7}),side:T.DoubleSide});if(typeof document==='undefined')return new T.Mesh(new T.PlaneGeometry(3,0.56),mat());const c=document.createElement('canvas');c.width=256;c.height=48;const g=c.getContext('2d')!;g.fillStyle='#11191B';g.fillRect(0,0,256,48);g.fillStyle='#E8ECE7';g.font='bold 24px monospace';g.textAlign='center';g.fillText(text,128,33);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return new T.Mesh(new T.PlaneGeometry(3,0.56),mat(t));}
export function street(){const g=new T.Group();const cw=new CW();M.concrete.map=M.concrete.map??concrete();
const walls:T.Object3D[]=[];const solids:SolidRec[]=[];
const col=(x:number,z:number,w:number,d:number)=>{cw.add({minX:x-w/2,minZ:z-d/2,maxX:x+w/2,maxZ:z+d/2});solids.push({x,z,w,d});};
const solid=(o:T.Object3D,x:number,z:number,w:number,d:number)=>{o.position.x=x;o.position.z=z;g.add(o);walls.push(o);col(x,z,w,d);return o;};
// ground: dirt base + plaza slab + faded lane ticks
const base=new T.Mesh(new T.BoxGeometry(70,0.2,70),M.concrete);base.position.set(0,-0.11,0);g.add(base);
const slab=new T.Mesh(new T.BoxGeometry(48,0.08,48),M.steelM);slab.position.set(0,0.0,0);g.add(slab);
const tickM=new T.MeshBasicMaterial({color:0x8a9290});
for(let i=-3;i<=3;i++){for(const [w,d,x,z] of [[0.3,2,i*6,-20],[0.3,2,i*6,20],[2,0.3,-20,i*6],[2,0.3,20,i*6]] as const){const t=new T.Mesh(new T.BoxGeometry(w,0.09,d),tickM);t.position.set(x,0.045,z);g.add(t);}}
// ring buildings (faces toward plaza)
const hs=[12,9,14,10];let hi=0;
for(const z of [-30,30])for(const x of [-11,11]){const b=building(20,hs[hi++%4],12);solid(b,x,z,20,12);}
for(const x of [-30,30])for(const z of [-11,11]){const b=building(20,hs[hi++%4],12);b.rotation.y=Math.PI/2;solid(b,x,z,12,20);}
// visible bounds: low concrete ring wall + corner posts
const wallM=M.concrete;
for(const z of [-23,23])for(const x of [-15.5,0,15.5])solid(new T.Mesh(new T.BoxGeometry(14,1.3,0.6),wallM),x,z,14,0.6);
for(const x of [-23,23])for(const z of [-15.5,0,15.5])solid(new T.Mesh(new T.BoxGeometry(0.6,1.3,14),wallM),x,z,0.6,14);
for(const x of [-23,23])for(const z of [-23,23])solid(new T.Mesh(new T.BoxGeometry(1.2,2.2,1.2),M.steelD),x,z,1.2,1.2);
// wrecked cars (axis-aligned; 2.0x4.4 box covers 1.8x4.2 mesh exactly)
const cars:[number,number][]=[[8,6],[-8,-6],[8,-6],[-8,6]];
cars.forEach(([x,z],i)=>{const m=car([0x6e2e2e,0x2e4a6e,0x5a5a3a,0x4a3a5a][i%4]);solid(m,x,z,2.0,4.4);});
// barrier cover + dumpster crates
for(const [x,z] of [[-4,12],[4,-12],[-12,0],[12,0]] as const){const b=barrier();solid(b,x,z,2,0.5);}
for(const [x,z] of [[-14,10],[14,-10]] as const){const c=crate(1.5);solid(c,x,z,1.5,1.5);}
// lamp poles (thin collider at base); 3 lit max
const lamps:T.Group[]=[];const lit=new Set(['-20,12','20,-12','0,20']);const lampPts:[number,number][]=[[-20,12],[20,12],[-20,-12],[20,-12],[-12,20],[12,-20]];
for(const [x,z] of lampPts){const l=streetlamp(lit.has(x+','+z));if(x>0)l.rotation.y=Math.PI;l.position.y=0;l.position.x=x;l.position.z=z;g.add(l);lamps.push(l);col(x,z,0.35,0.35);}
// ammo crates (military green, teal dot)
const cratePts=[{x:-3.5,z:4},{x:3.5,z:-8}];const crateMeshes:T.Group[]=[];
for(const p of cratePts){const ac=ammoCrate();ac.position.set(p.x,0,p.z);g.add(ac);walls.push(ac);col(p.x,p.z,1.3,0.9);crateMeshes.push(ac);}
const s1=sign('SIGNAL PLAZA');s1.position.set(0,3.2,22.4);s1.rotation.y=Math.PI;g.add(s1);
const s2=sign('QUARANTINE');s2.position.set(0,3.2,-22.4);g.add(s2);
g.add(new T.HemisphereLight(0x6b8296,0x0a0f10,0.5));const moon=new T.DirectionalLight(0xa8c0e0,1.35);moon.position.set(-8,20,-10);g.add(moon);
const spawns=[{x:-19,z:-19},{x:19,z:-19},{x:-19,z:19},{x:19,z:19},{x:-19,z:0},{x:19,z:0},{x:0,z:-19},{x:0,z:19}];
return{group:g,cw,walls,spawns,player0:{x:0,z:20},lamps,crates:cratePts,crateMeshes,fogColor:0x0b1012,fogNear:45,fogFar:130,solids,nav:{x0:-32,z0:-32,nx:64,nz:64}};}
