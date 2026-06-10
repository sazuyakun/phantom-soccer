import { useLoader } from "@react-three/fiber"
import { useMemo } from "react"
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from "three"

import floorTextureUrl from "../../assets/floor.png"

// The visual floor is much bigger than the playable area so its far
// edge sits at the horizon instead of in view.
const FLOOR_SIZE = 100

/**
 * Non-interactable environment: the plain, flat ground players move
 * around on. Static geometry, never re-renders.
 */
export function MovementArea() {
  const texture = useLoader(TextureLoader, floorTextureUrl)

  useMemo(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(FLOOR_SIZE / 2, FLOOR_SIZE / 2)
    texture.colorSpace = SRGBColorSpace
  }, [texture])

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
