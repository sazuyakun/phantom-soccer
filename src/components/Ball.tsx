import { useFrame, useLoader } from "@react-three/fiber"
import { useRef } from "react"
import { Mesh, SRGBColorSpace, TextureLoader, Vector3 } from "three"

import ballTextureUrl from "../assets/ball.png"
import { BALL_RADIUS } from "../shared/constants"
import { Ball as BallState } from "../shared/types"

const SNAP_DISTANCE = 3
const SETTLE_SPEED = 4

const rollAxis = new Vector3()

export function Ball({ ball }: { ball: BallState }) {
  const mesh = useRef<Mesh>(null)
  const texture = useLoader(TextureLoader, ballTextureUrl)
  texture.colorSpace = SRGBColorSpace

  useFrame((_, delta) => {
    const m = mesh.current
    if (!m) return

    const targetY = ball.position.y + BALL_RADIUS
    const stepY = Math.max(4, Math.abs(ball.velocity.y)) * delta
    if (m.position.y < targetY)
      m.position.y = Math.min(targetY, m.position.y + stepY)
    else m.position.y = Math.max(targetY, m.position.y - stepY)

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

    rollAxis.set(moveZ, 0, -moveX).normalize()
    m.rotateOnWorldAxis(rollAxis, step / BALL_RADIUS)
  })

  return (
    <mesh ref={mesh} position={[0, BALL_RADIUS, 0]}>
      <sphereGeometry args={[BALL_RADIUS, 32, 32]} />
      <meshStandardMaterial map={texture} roughness={0.4} />
    </mesh>
  )
}
