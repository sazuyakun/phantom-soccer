import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import { CanvasTexture, Mesh, SRGBColorSpace, Vector3 } from "three"

import { Ball as BallState } from "../shared/types"

const RADIUS = 0.3
// corrections larger than this snap instead of gliding
const SNAP_DISTANCE = 2
// glide speed once the ball has stopped but the render lags behind
const SETTLE_SPEED = 4

const rollAxis = new Vector3()

// classic white ball with black patches, drawn once on a canvas —
// lighter than any downloaded model
function createBallTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = "#222222"
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.beginPath()
      ctx.arc(32 + col * 64 + (row % 2) * 32, 32 + row * 64, 13, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

export function Ball({ ball }: { ball: BallState }) {
  const mesh = useRef<Mesh>(null)
  const texture = useMemo(createBallTexture, [])

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return

    const dx = ball.position.x - m.position.x
    const dz = ball.position.z - m.position.z
    const distance = Math.hypot(dx, dz)
    if (distance === 0) return

    if (distance > SNAP_DISTANCE) {
      m.position.x = ball.position.x
      m.position.z = ball.position.z
      return
    }

    const speed = Math.hypot(ball.velocity.x, ball.velocity.z)
    const step = Math.min(Math.max(speed, SETTLE_SPEED) * delta, distance)
    const moveX = (dx / distance) * step
    const moveZ = (dz / distance) * step
    m.position.x += moveX
    m.position.z += moveZ

    // roll around the axis perpendicular to the motion
    rollAxis.set(moveZ, 0, -moveX).normalize()
    m.rotateOnWorldAxis(rollAxis, step / RADIUS)
  })

  return (
    <mesh ref={mesh} position={[0, RADIUS, 0]}>
      <sphereGeometry args={[RADIUS, 24, 24]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
