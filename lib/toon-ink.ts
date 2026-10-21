import * as T from 'three';
/** Back-face shells preserve animated joints and produce clean illustrated silhouettes. */
export function inkSilhouettes(root:T.Object3D,minRadius=0){
 const meshes:T.Mesh[]=[];
 root.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshToonMaterial&&o.material.visible)meshes.push(o)});
 const ink=new T.MeshBasicMaterial({color:0x24343a,side:T.BackSide,depthWrite:false});
 for(const mesh of meshes){
  if(minRadius){mesh.geometry.computeBoundingSphere();if((mesh.geometry.boundingSphere?.radius||0)<minRadius)continue;}
  const shell=new T.Mesh(mesh.geometry,ink);shell.scale.setScalar(1.018);shell.raycast=()=>{};shell.userData.ink=true;mesh.add(shell);
 }
}
