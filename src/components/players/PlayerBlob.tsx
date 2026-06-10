import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Group } from "three"

import { MOVE_SPEED } from "../../shared/constants"
import { Character } from "../../shared/types"
import { characterRefs } from "./characterRefs"

// one color per player, picked by join order
const BLOB_COLORS = ["#e2574c", "#4c8be2"]

// how fast a blob turns to face its direction of travel, radians/second
const TURN_SPEED = 10
// corrections larger than this (e.g. a server rollback) snap instead
// of gliding across the field
const SNAP_DISTANCE = 2

// move-toward interpolation for angles, wrapping around ±π
function interpolateAngle(current: number, target: number, step: number) {
  if (Math.abs(target - current) > Math.PI) {
    current += Math.sign(target - current) * 2 * Math.PI
  }
  if (current < target) return Math.min(target, current + step)
  return Math.max(target, current - step)
}

/**
 * Placeholder player: a blob with a face and hands, built from
 * primitives. The whole component gets swapped for a glTF model later —
 * its interface (a Character to render) stays the same.
 */
export function PlayerBlob(props: {
  character: Character
  colorIndex: number
}) {
  const { character, colorIndex } = props
  const color = BLOB_COLORS[colorIndex % BLOB_COLORS.length]

  // position and rotation are driven from useFrame, never from props,
  // so React re-renders can't fight the interpolation; the spawn pose
  // is frozen here purely for initial placement
  const group = useRef<Group>(null)
  const [spawn] = useState(() => ({
    position: [
      character.position.x,
      character.position.y,
      character.position.z,
    ] as const,
    angle: character.angle,
  }))

  // expose the rendered node so the camera rig can follow it
  useEffect(() => {
    const g = group.current
    if (g) characterRefs.set(character.id, g)
    return () => {
      characterRefs.delete(character.id)
    }
  }, [character.id])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return

    const target = character.position
    const dx = target.x - g.position.x
    const dz = target.z - g.position.z
    const distance = Math.hypot(dx, dz)

    if (distance > SNAP_DISTANCE) {
      g.position.set(target.x, target.y, target.z)
      g.rotation.y = character.angle
      return
    }

    // the logic only ticks 10 times a second, so every frame we walk the
    // rendered position toward the logic position ALONG the actual
    // direction of travel at the speed the logic reported — per-axis
    // stepping would finish each axis early on diagonals and stutter.
    // (speed falls back to MOVE_SPEED to glide to rest after stopping)
    const step = (character.speed || MOVE_SPEED) * delta
    if (step >= distance) {
      g.position.x = target.x
      g.position.z = target.z
    } else {
      g.position.x += (dx / distance) * step
      g.position.z += (dz / distance) * step
    }
    g.rotation.y = interpolateAngle(
      g.rotation.y,
      character.angle,
      TURN_SPEED * delta
    )
  })

  return (
    <group ref={group} position={spawn.position} rotation-y={spawn.angle}>
      {/* body */}
      <mesh position-y={0.55}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* eyes */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.18, 0.72, 0.46]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial color="#222222" />
        </mesh>
      ))}

      {/* mouth */}
      <mesh position={[0, 0.48, 0.51]}>
        <boxGeometry args={[0.22, 0.05, 0.05]} />
        <meshBasicMaterial color="#222222" />
      </mesh>

      {/* hands */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.6, 0.45, 0]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  )
}
