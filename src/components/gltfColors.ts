import { Mesh, MeshStandardMaterial, Object3D } from "three"

// Kenney/Quaternius-era glTF exports double-gamma their material colors
// and render near-black; converting back once restores the palette.
// Materials are cloned so the shared, cached glTF scene stays untouched.
export function restoreGltfColors(root: Object3D) {
  root.traverse((node) => {
    if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
      node.material = node.material.clone()
      node.material.color.convertLinearToSRGB()
    }
  })
}
