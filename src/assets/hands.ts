import * as T from 'three';
// tan tactical gloves + olive cuffs, built OUTSIDE gun volumes (palm offset +x, fingers wrap -x screen side)
const glove=new T.MeshLambertMaterial({color:0x9a8a68});const cuffM=new T.MeshLambertMaterial({color:0x4c4a38});
const b=(g:T.Group,w:number,h:number,d:number,m:T.Material,x:number,y:number,z:number,rx=0,rz=0)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.rotation.x=rx;o.rotation.z=rz;g.add(o);return o;};
// grip hand: palm right of grip, fingers curl around front (-z), thumb across back
export function gripHand(){const g=new T.Group();b(g,0.055,0.1,0.075,glove,0.062,-0.005,0.005);for(let i=0;i<4;i++)b(g,0.09,0.023,0.03,glove,0.0,-0.037+i*0.024,-0.046,-0.35);b(g,0.024,0.065,0.032,glove,-0.008,0.022,0.056,0,0.5);b(g,0.07,0.08,0.066,cuffM,0.068,0.105,0.058,-0.35);g.scale.setScalar(1.2);return g;}
// support hand: palm under forend, fingers curl up screen side, cuff toward shooter
export function supHand(){const g=new T.Group();b(g,0.08,0.032,0.105,glove,0,0,0);for(let i=0;i<3;i++)b(g,0.026,0.075,0.032,glove,-0.04,0.045,-0.032+i*0.032,0,0.12);b(g,0.026,0.055,0.032,glove,0.042,0.032,0.02,0,-0.3);b(g,0.082,0.075,0.068,cuffM,0,-0.005,0.105,0.4);return g;}
export function addHands(g:T.Group,gx:number,gy:number,gz:number,sx:number,sy:number,sz:number,ride=false){const gr=gripHand();gr.position.set(gx,gy,gz);gr.rotation.x=0.25;g.add(gr);g.userData.grip=gr;const sp=supHand();sp.position.set(sx,sy,sz);g.add(sp);g.userData.sup=sp;g.userData.supBase=sp.position.clone();g.userData.supRide=ride;}
// gun-local presets: origins at grip/forend part centers (hands are vm children)
export const HM:Record<string,{g:[number,number,number];s:[number,number,number]}>={pistol:{g:[0,-0.1,0.06],s:[0,-0.075,-0.1]},heavy:{g:[0,-0.105,0.06],s:[0,-0.08,-0.1]},shotgun:{g:[0,-0.09,0.1],s:[0,-0.115,-0.28]},smg:{g:[0,-0.08,0.1],s:[0.01,-0.125,-0.16]},rapid:{g:[0,-0.08,0.1],s:[0.01,-0.125,-0.15]},rifle:{g:[0,-0.075,0.14],s:[0.01,-0.12,-0.2]},marksman:{g:[0,-0.075,0.14],s:[0.01,-0.12,-0.18]},lmg:{g:[0,-0.085,0.12],s:[0.01,-0.16,-0.02]}};
