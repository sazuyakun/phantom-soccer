import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"

import { characterRefs } from "./players/characterRefs"

// Follows the local player at a constant offset, never rotating,
// so the world appears to move around your character.
const CAMERA_OFFSET = new Vector3(0, 2.5, 3.5)
const LOOK_HEIGHT = 2.3

const playerPosition = new Vector3()

export function CameraRig({ targetId }: { targetId?: string }) {
  useFrame(({ camera }) => {
    const target = targetId ? characterRefs.get(targetId) : undefined
    if (!target) return

    // world position, because the world group is rotated per side;
    // y stays at ground level so jumps move the character, not the camera
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
