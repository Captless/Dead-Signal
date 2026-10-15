import * as T from 'three';import { EP } from '../config/enemies';import { DF, DK } from '../config/difficulty';import { CW } from '../core/CollisionWorld';import { Nav } from '../core/NavigationGrid';import { drifter, rusher, brute, runner, crusher, stalker } from '../assets/zombieModels';import { disp } from '../utils/disposal';
export type ES='spawn'|'chase'|'windup'|'strike'|'recover'|'dead';
const R=(u:any)=>u as {armL:T.Group;armR:T.Group;legL:T.Group;legR:T.Group;elbL:T.Group;elbR:T.Group;knL:T.Group;knR:T.Group;head:T.Group;torso:T.Group;jaw:T.Group};
export class E{hp:number;max:number;st:ES='spawn';t=0.5;cd=0;spd;range;dmg;mesh:T.Group;reward;dead=false;kind:string;sx=false;fl=0;deadT=0;private animT=Math.random()*10;private wp:{x:number;z:number}[]=[];private rp=0;private lx=0;private lz=0;private st2=0;private wu;private sk;private rc;private fall=1;private bx=0;private bz=0;private sdx=0;private sdz=0;
constructor(x:number,z:number,kind='drifter',diff:DK='standard'){const d=EP[kind],m=DF[diff];this.kind=kind;this.max=this.hp=Math.round(d.hp*m.eHp);this.spd=d.spd*m.eSpd;this.range=d.range;this.dmg=Math.round(d.dmg*m.eDmg);this.reward=Math.round(d.reward*m.scrap);this.wu=d.windup;this.sk=d.strike;this.rc=d.recover;this.cd0=d.cd;const v=Math.random()*3|0;this.mesh=kind==='rusher'?rusher(v):kind==='brute'?brute(v):kind==='runner'?runner(v):kind==='crusher'?crusher(v):kind==='stalker'?stalker(v):drifter(v);this.mesh.position.set(x,0,z);}
private cd0;
hit(dmg:number){if(this.st==='dead')return false;this.hp-=dmg;if(this.hp<=0){this.hp=0;this.st='dead';this.dead=true;this.deadT=0;this.fall=Math.random()<0.5?-1:1;this.bx=this.pos.x;this.bz=this.pos.z;this.sdx=Math.sin(this.mesh.rotation.y);this.sdz=Math.cos(this.mesh.rotation.y);const r=R(this.mesh.userData);r.armL.rotation.set(-1.2,0,1.1);r.armR.rotation.set(-1.2,0,-1.1);r.elbL.rotation.x=-0.2;r.elbR.rotation.x=-0.2;r.knL.rotation.x=0.3;r.knR.rotation.x=-0.2;r.jaw.rotation.x=0.5;return true;}this.fl=0.15;return false;}
private rig(){const u=this.mesh.userData;for(const k of ['armL','armR','legL','legR','elbL','elbR','knL','knR','head','torso','jaw'])if(!u[k])u[k]=new T.Group();return R(u);}
update(dt:number,px:number,pz:number,cw:CW,hurt:(d:number)=>void,nav?:Nav){
if(this.st==='dead'){this.deadT+=dt;const k=Math.min(1,this.deadT/0.45),e=1-(1-k)*(1-k);this.mesh.rotation.x=-this.fall*Math.PI/2*e;this.mesh.position.set(this.bx-this.fall*this.sdx*0.35*e,0.32*e,this.bz-this.fall*this.sdz*0.35*e);return;}
if(this.st==='spawn'){this.t-=dt;const r0=this.rig();this.animT+=dt;const k=1-Math.max(0,this.t)/0.5;r0.torso.scale.y=1+Math.sin(this.animT*6)*0.03;r0.torso.rotation.x=-0.12*(1-k);if(this.t<=0){r0.torso.scale.y=1;r0.torso.rotation.x=0;this.st='chase';}return;}
if(this.fl>0){this.fl-=dt;const r=this.rig();r.torso.rotation.z=Math.sin(this.fl*60)*0.12;return;}
if(this.cd>0)this.cd-=dt;const dx=px-this.pos.x,dz=pz-this.pos.z,d=Math.hypot(dx,dz)||1e-6;const r=this.rig();
if(this.st==='chase'){if(d<=this.range&&this.cd<=0){this.st='windup';this.t=this.wu;r.armL.rotation.x=-2.2;r.armR.rotation.x=-2.4;}
else if(d>this.range){let tx=dx/d,tz=dz/d;const blocked=cw.blocked(this.pos.x,this.pos.z,px,pz);
if(blocked&&nav){this.rp-=dt;if(this.rp<=0||!this.wp.length){this.wp=nav.path(this.pos.x,this.pos.z,px,pz).slice(0,8);this.rp=1.0;}const n=this.wp[0];if(n){if(Math.hypot(n.x-this.pos.x,n.z-this.pos.z)<0.6)this.wp.shift();else{const l=Math.hypot(n.x-this.pos.x,n.z-this.pos.z)||1e-6;tx=(n.x-this.pos.x)/l;tz=(n.z-this.pos.z)/l;}}}
this.st2+=dt;if(this.st2>=1){const moved=Math.hypot(this.pos.x-this.lx,this.pos.z-this.lz);this.lx=this.pos.x;this.lz=this.pos.z;this.st2=0;if(moved<0.05){const s=tx;tx=-tz;tz=s;}}
if(this.kind==='stalker'){const s=Math.sin(this.animT*3)*0.6;const qx=tx-tz*s,qz=tz+tx*s,l=Math.hypot(qx,qz)||1;tx=qx/l;tz=qz/l;}
const p={x:this.pos.x+tx*this.spd*dt,z:this.pos.z+tz*this.spd*dt};cw.resolve(p,0.4);this.pos.x=p.x;this.pos.z=p.z;this.mesh.lookAt(px,0,pz);
if(d<25){this.animT+=dt*(this.kind==='runner'?13:this.kind==='rusher'?11:this.kind==='stalker'?8:this.kind==='brute'?4.5:this.kind==='crusher'?3.5:7);
const sw=this.kind==='brute'||this.kind==='crusher'?0.35:0.6,s=this.animT;
r.legL.rotation.x=Math.sin(s)*sw;r.legR.rotation.x=-Math.sin(s)*sw;
r.armL.rotation.x=-0.5+Math.sin(s)*sw*0.5;r.armR.rotation.x=-0.25-Math.sin(s)*sw*0.5;r.knL.rotation.x=Math.max(0,-Math.sin(s))*0.7;r.knR.rotation.x=Math.max(0,Math.sin(s))*0.7;r.elbL.rotation.x=-0.35+Math.sin(s)*0.15;r.elbR.rotation.x=-0.45-Math.sin(s)*0.15;
r.head.rotation.y=Math.max(-0.6,Math.min(0.6,Math.sin(s*0.5)*0.3+Math.sin(s*0.13)*0.2));r.head.rotation.x=0.1+Math.sin(s*0.7)*0.05;if(this.kind==='brute'||this.kind==='crusher')r.torso.rotation.z=Math.sin(s)*0.08;
this.mesh.position.y=Math.abs(Math.sin(s))*(this.kind==='brute'||this.kind==='crusher'?0.03:0.05);}}}
else if(this.st==='windup'){this.t-=dt;this.animT+=dt;const k=1-Math.max(0,this.t)/this.wu;r.armL.rotation.x=-2.2-k*0.4;r.armR.rotation.x=-2.4-k*0.4;r.elbL.rotation.x=-1.2;r.elbR.rotation.x=-1.3;r.torso.rotation.x=-0.15*k;r.jaw.rotation.x=0.15+Math.abs(Math.sin(this.animT*20))*0.45;r.head.rotation.x=0.28;if(this.t<=0){this.st='strike';this.t=this.sk;if(Math.hypot(px-this.pos.x,pz-this.pos.z)<=this.range+0.3&&!cw.blocked(this.pos.x,this.pos.z,px,pz))hurt(this.dmg);}}
else if(this.st==='strike'){this.t-=dt;r.armL.rotation.x=-0.6;r.armR.rotation.x=-0.6;r.elbL.rotation.x=-0.1;r.elbR.rotation.x=-0.1;r.torso.rotation.x=0.25;r.jaw.rotation.x=0;if(this.t<=0){this.st='recover';this.t=this.rc;this.cd=this.cd0;}}
else if(this.st==='recover'){this.t-=dt;r.armL.rotation.x=-0.5;r.armR.rotation.x=-0.25;r.torso.rotation.x=0;r.head.rotation.x=0.1;if(this.t<=0)this.st='chase';}}
get pos(){return this.mesh.position;}dispose(){disp(this.mesh);}}
