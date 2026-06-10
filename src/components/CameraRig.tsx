import { useFrame } from "@react-three/fiber"
import { Vector3 } from "three"

import { characterRefs } from "./players/characterRefs"

// The camera is fixed relative to the player, Brawl Stars style: it
// follows at a constant offset and never rotates, so the world appears
// to move around your character.
const CAMERA_OFFSET = new Vector3(0, 2, 4)
const LOOK_HEIGHT = 0.7

const playerPosition = new Vector3()

export function CameraRig({ targetId }: { targetId?: string }) {
  useFrame(({ camera }) => {
    const target = targetId ? characterRefs.get(targetId) : undefined
    if (!target) return

    // world position, because the world group is rotated per player side
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
