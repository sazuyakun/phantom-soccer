import { Mesh, MeshStandardMaterial, Object3D } from "three"

export function restoreGltfColors(root: Object3D) {
  root.traverse((node) => {
    if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
      node.material = node.material.clone()
      node.material.color.convertLinearToSRGB()
    }
  })
}
