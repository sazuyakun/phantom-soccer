import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"

import { characterRefs } from "./players/characterRefs"

const CAMERA_OFFSET = new Vector3(0, 2.5, 3.5)
const LOOK_HEIGHT = 2.3

const playerPosition = new Vector3()

export function CameraRig({ targetId }: { targetId?: string }) {
  useFrame(({ camera }) => {
    const target = targetId ? characterRefs.get(targetId) : undefined
    if (!target) return

    target.getWorldPosition(playerPosition)
    playerPosition.y = 0
    camera.position.copy(playerPosition).add(CAMERA_OFFSET)
    camera.lookAt(
      playerPosition.x,
      playerPosition.y + LOOK_HEIGHT,
      playerPosition.z
    )
  })

  return null
}
