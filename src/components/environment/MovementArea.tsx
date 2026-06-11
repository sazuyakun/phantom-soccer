import { useMemo } from "react"
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three"

// much larger than the play area so its edge sits past the horizon
const FLOOR_SIZE = 100
// world units covered by one repeat of the texture
const GRASS_TILE = 16

const GREENS = ["#6abf4b", "#5fb343", "#74c853", "#65b948"]

// flat-shaded triangles in a few shades of green — the low-poly look
// without any downloaded asset
function createLowPolyGrassTexture() {
  const size = 256
  const cell = 64
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!

  const shade = () => GREENS[Math.floor(Math.random() * GREENS.length)]
  for (let x = 0; x < size; x += cell) {
    for (let y = 0; y < size; y += cell) {
      ctx.fillStyle = shade()
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + cell, y)
      ctx.lineTo(x, y + cell)
      ctx.fill()
      ctx.fillStyle = shade()
      ctx.beginPath()
      ctx.moveTo(x + cell, y)
      ctx.lineTo(x + cell, y + cell)
      ctx.lineTo(x, y + cell)
      ctx.fill()
    }
  }

  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.repeat.set(FLOOR_SIZE / GRASS_TILE, FLOOR_SIZE / GRASS_TILE)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export function MovementArea() {
  const texture = useMemo(createLowPolyGrassTexture, [])

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[FLOOR_SIZE, FLOOR_SIZE]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
