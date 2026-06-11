import { useMemo } from "react"
import {
  CanvasTexture,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from "three"

const FLOOR_SIZE = 100
const STRIPE_PAIR = 8

function createStripeTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 2
  canvas.height = 2
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#74c655"
  ctx.fillRect(0, 0, 2, 1)
  ctx.fillStyle = "#67b94a"
  ctx.fillRect(0, 1, 2, 1)

  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(1, FLOOR_SIZE / STRIPE_PAIR)
  texture.magFilter = NearestFilter
  texture.colorSpace = SRGBColorSpace
  return texture
}

export function MovementArea() {
  const texture = useMemo(createStripeTexture, [])

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
