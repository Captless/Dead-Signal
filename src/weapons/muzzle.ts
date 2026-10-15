import * as T from 'three';
const _v=new T.Vector3(),_v2=new T.Vector2();
// Muzzle tip in world space via the viewmodel camera: project the gun-local
// muzzle through vc to NDC, then cast that NDC ray through the world camera.
// (vm lives under the origin-locked vr rig, so getWorldPosition is map-origin garbage.)
export function mzWorld(vm:T.Group,vc:T.Camera,cam:T.Camera,ray:T.Raycaster,out:T.Vector3){vm.updateMatrix();vc.updateMatrixWorld();const mz=(vm.userData.muzzle as T.Mesh|undefined)?.position;if(!mz)return out.copy(cam.position);_v.set(mz.x,mz.y,mz.z).applyMatrix4(vm.matrix).project(vc);ray.setFromCamera(_v2.set(_v.x,_v.y),cam);return ray.ray.at(0.6,out);}
// Damage-number anchor: resolve a foe-local hit back to world each tick so the
// number rides the zombie. Orphaned/disposed foes keep the last world point.
export function trackPoint(foe:T.Object3D|null,loc:T.Vector3,out:T.Vector3){if(foe&&foe.parent){foe.updateWorldMatrix(true,false);foe.localToWorld(out.copy(loc));}return out;}
// Reload beat table: phase marks per weapon with staged sounds.
export const BEATS:Record<string,{t:number;s:'click'|'reload'}[]>={pistol:[{t:0.3,s:'click'},{t:0.62,s:'reload'},{t:0.8,s:'reload'}],shotgun:[{t:0.2,s:'click'},{t:0.55,s:'reload'}],smg:[{t:0.3,s:'click'},{t:0.65,s:'reload'},{t:0.78,s:'click'}],rifle:[{t:0.3,s:'click'},{t:0.6,s:'reload'},{t:0.8,s:'reload'}],heavy:[{t:0.3,s:'click'},{t:0.62,s:'reload'},{t:0.8,s:'reload'}],rapid:[{t:0.3,s:'click'},{t:0.65,s:'reload'},{t:0.78,s:'click'}],marksman:[{t:0.3,s:'click'},{t:0.6,s:'reload'},{t:0.82,s:'reload'}],lmg:[{t:0.25,s:'click'},{t:0.55,s:'reload'},{t:0.8,s:'reload'}]};
