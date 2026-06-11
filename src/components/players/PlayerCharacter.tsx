import { useAnimations, useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import { Group } from "three"
import { SkeletonUtils } from "three-stdlib"

import { restoreGltfColors } from "../gltfColors"

import knightUrl from "../../assets/models/Knight_Male.gltf?url"
import pirateUrl from "../../assets/models/Pirate_Male.gltf?url"
import { MOVE_SPEED } from "../../shared/constants"
import { Character, isAirborne } from "../../shared/types"
import { characterRefs } from "./characterRefs"

const MODEL_URLS = [knightUrl, pirateUrl]
MODEL_URLS.forEach((url) => useGLTF.preload(url))

const TURN_SPEED = 10
const SNAP_DISTANCE = 2

function moveToward(current: number, target: number, step: number) {
  if (current < target) return Math.min(target, current + step)
  return Math.max(target, current - step)
}

function interpolateAngle(current: number, target: number, step: number) {
  if (Math.abs(target - current) > Math.PI) {
    current += Math.sign(target - current) * 2 * Math.PI
  }
  return moveToward(current, target, step)
}

export function PlayerCharacter(props: {
  character: Character
  modelIndex: number
}) {
  const { character, modelIndex } = props

  const { scene, animations } = useGLTF(
    MODEL_URLS[modelIndex % MODEL_URLS.length]
  )
  const model = useMemo(() => {
    const clone = SkeletonUtils.clone(scene)
    restoreGltfColors(clone)
    return clone
  }, [scene])

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

    const anim = isAirborne(character)
      ? "Jump"
      : character.speed > 0
        ? "Run"
        : "Idle"
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

    const stepY = Math.max(3, Math.abs(character.velocityY)) * delta
    g.position.y = moveToward(g.position.y, target.y, stepY)
  })

  return (
    <group ref={group} position={spawn.position} rotation-y={spawn.angle}>
      <primitive object={model} />
    </group>
  )
}
