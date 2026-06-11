import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"

import { characterRefs } from "./players/characterRefs"

// Follows the local player at a constant offset, never rotating,
// so the world appears to move around your character.
const CAMERA_OFFSET = new Vector3(0, 3, 3.5)
const LOOK_HEIGHT = 1.2

const playerPosition = new Vector3()

export function CameraRig({ targetId }: { targetId?: string }) {
  useFrame(({ camera }) => {
    const target = targetId ? characterRefs.get(targetId) : undefined
    if (!target) return

    // world position, because the world group is rotated per side
    target.getWorldPosition(playerPosition)
    camera.position.copy(playerPosition).add(CAMERA_OFFSET)
    camera.lookAt(
      playerPosition.x,
      playerPosition.y + LOOK_HEIGHT,
      playerPosition.z
    )
  })

  return null
}
