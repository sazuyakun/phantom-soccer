import { useLoader } from "@react-three/fiber"
import { RepeatWrapping, SRGBColorSpace, TextureLoader } from "three"

import grassTextureUrl from "../../assets/grass.jpg"

// much larger than the play area so its edge sits past the horizon
const FLOOR_SIZE = 100
// world units covered by one repeat of the grass texture
const GRASS_TILE = 5

export function MovementArea() {
  // useLoader caches the texture, so this configuration is idempotent
  const texture = useLoader(TextureLoader, grassTextureUrl)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(FLOOR_SIZE / GRASS_TILE, FLOOR_SIZE / GRASS_TILE)
  texture.colorSpace = SRGBColorSpace

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
