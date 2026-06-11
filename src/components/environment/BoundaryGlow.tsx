import { useMemo } from "react"
import { CanvasTexture, DoubleSide } from "three"

import { STADIUM_RADIUS } from "../../shared/constants"

const GLOW_HEIGHT = 1.2

// vertical gradient, orange at the ground fading out upward
function createGlowTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 1
  canvas.height = 64
  const ctx = canvas.getContext("2d")!
  // additive blending would sum with the green grass into yellow, so
  // this stays on normal blending with a saturated fire orange
  const gradient = ctx.createLinearGradient(0, 0, 0, 64)
  gradient.addColorStop(0, "rgba(255, 80, 0, 0)")
  gradient.addColorStop(1, "rgba(255, 80, 0, 0.55)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 64)
  return new CanvasTexture(canvas)
}

/**
 * A soft orange glow rising from the field boundary line — one
 * open cylinder with a gradient texture, additively blended.
 */
export function BoundaryGlow() {
  const texture = useMemo(createGlowTexture, [])

  return (
    <mesh position-y={GLOW_HEIGHT / 2}>
      <cylinderGeometry
        args={[STADIUM_RADIUS, STADIUM_RADIUS, GLOW_HEIGHT, 96, 1, true]}
      />
      <meshBasicMaterial
        map={texture}
        transparent
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}
