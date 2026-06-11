import { useAnimations, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import { Group, Mesh, MeshStandardMaterial } from "three"
import { SkeletonUtils } from "three-stdlib"

import knightUrl from "../../assets/models/Knight_Male.gltf?url"
import pirateUrl from "../../assets/models/Pirate_Male.gltf?url"
import { MOVE_SPEED } from "../../shared/constants"
import { Character } from "../../shared/types"
import { characterRefs } from "./characterRefs"

// one model per player, picked by join order
const MODEL_URLS = [knightUrl, pirateUrl]
MODEL_URLS.forEach((url) => useGLTF.preload(url))

// how fast a character turns to face its travel direction, radians/sec
const TURN_SPEED = 10
// corrections larger than this (e.g. a rollback) snap instead of gliding
const SNAP_DISTANCE = 2

// move-toward for angles, wrapping around ±π
function interpolateAngle(current: number, target: number, step: number) {
  if (Math.abs(target - current) > Math.PI) {
    current += Math.sign(target - current) * 2 * Math.PI
  }
  if (current < target) return Math.min(target, current + step)
  return Math.max(target, current - step)
}

export function PlayerCharacter(props: {
  character: Character
  modelIndex: number
}) {
  const { character, modelIndex } = props

  const { scene, animations } = useGLTF(
    MODEL_URLS[modelIndex % MODEL_URLS.length]
  )
  // the loaded scene is shared and cached; each player gets a skeleton-aware clone
  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    // these exports double-gamma their colors and render near-black;
    // converting back once restores the intended palette
    clone.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material = node.material.clone()
        node.material.color.convertLinearToSRGB()
      }
    })
    return clone
  }, [scene])

  // the transform is driven from useFrame; the spawn pose is frozen so
  // React prop re-application can't fight the interpolation
  const group = useRef<Group>(null)
  const [spawn] = useState(() => ({
    position: [
      character.position.x,
      character.position.y,
      character.position.z,
    ] as const,
    angle: character.angle,
  }))

  const { actions } = useAnimations(animations, group)
  const currentAnim = useRef("Idle")

  useEffect(() => {
    actions.Idle?.play()
  }, [actions])

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

    const anim = character.speed > 0 ? "Run" : "Idle"
    if (anim !== currentAnim.current) {
      actions[currentAnim.current]?.fadeOut(0.2)
      actions[anim]?.reset().fadeIn(0.2).play()
      currentAnim.current = anim
    }

    const target = character.position
    const dx = target.x - g.position.x
    const dz = target.z - g.position.z
    const distance = Math.hypot(dx, dz)

    if (distance > SNAP_DISTANCE) {
      g.position.set(target.x, target.y, target.z)
      g.rotation.y = character.angle
      return
    }

    // walk toward the logic position along the travel direction at the
    // reported speed (per-axis stepping stutters on diagonals);
    // MOVE_SPEED fallback glides the last stretch after stopping
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
      <primitive object={model} />
    </group>
  )
}
