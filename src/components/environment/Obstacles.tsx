import { useGLTF } from "@react-three/drei"
import { useMemo } from "react"

import rockAUrl from "../../assets/models/rock_tallA.glb?url"
import rockBUrl from "../../assets/models/rock_tallB.glb?url"
import stoneAUrl from "../../assets/models/stone_tallA.glb?url"
import { OBSTACLE_HEIGHT } from "../../shared/constants"
import { Obstacle } from "../../shared/types"
import { restoreGltfColors } from "../gltfColors"

const ROCK_URLS = [rockAUrl, rockBUrl, stoneAUrl]
ROCK_URLS.forEach((url) => useGLTF.preload(url))

function Rock({ obstacle, index }: { obstacle: Obstacle; index: number }) {
  const { scene } = useGLTF(ROCK_URLS[index % ROCK_URLS.length])
  const model = useMemo(() => {
    const clone = scene.clone()
    restoreGltfColors(clone)
    return clone
  }, [scene])

  const rotation = (obstacle.x * 7 + obstacle.z * 13) % (Math.PI * 2)

  return (
    <primitive
      object={model}
      position={[obstacle.x, 0, obstacle.z]}
      rotation-y={rotation}
      scale={[obstacle.radius * 2, OBSTACLE_HEIGHT + 0.2, obstacle.radius * 2]}
    />
  )
}

export function Obstacles({ obstacles }: { obstacles: Obstacle[] }) {
  return (
    <group>
      {obstacles.map((obstacle, index) => (
        <Rock key={index} obstacle={obstacle} index={index} />
      ))}
    </group>
  )
}
