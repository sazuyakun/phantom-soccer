import { useMemo } from "react"
import { CanvasTexture, DoubleSide } from "three"

import { GOAL_COLORS, STADIUM_RADIUS } from "../../shared/constants"

const GLOW_HEIGHT = 2.5

// vertical gradient in the side's team color, fading out upward.
// normal blending — additive would sum with the grass into yellow
function createGlowTexture(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 64
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createLinearGradient(0, 0, 0, 64)
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.55)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 64)
  return new CanvasTexture(canvas)
}

/**
 * A soft glow rising from the field boundary, each half in the color
 * of the goal it surrounds — two half-cylinders with gradient textures.
 */
export function BoundaryGlow() {
  const textures = useMemo(
    () => ({
      1: createGlowTexture(GOAL_COLORS[1]),
      [-1]: createGlowTexture(GOAL_COLORS[-1]),
    }),
    []
  )

  return (
    <group>
      {([1, -1] as const).map((side) => (
        <mesh key={side} position-y={GLOW_HEIGHT / 2}>
          <cylinderGeometry
            args={[
              STADIUM_RADIUS,
              STADIUM_RADIUS,
              GLOW_HEIGHT,
              48,
              1,
              true,
              // the +z half wraps the side-1 goal, the -z half the other
              side === 1 ? -Math.PI / 2 : Math.PI / 2,
              Math.PI,
            ]}
          />
          <meshBasicMaterial
            map={textures[side]}
            transparent
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
