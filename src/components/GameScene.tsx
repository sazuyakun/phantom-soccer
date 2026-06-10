import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"

import { MovementArea } from "./environment/MovementArea"

const SKY_BLUE = "#87ceeb"

// The camera is fixed: it never moves, everything moves in front of it.
// Low and almost level with the ground so the floor runs out to a
// fog-faded horizon, like the Rune three.js tech demo.
const CAMERA_POSITION: [number, number, number] = [0, 2.5, 8]
const CAMERA_LOOK_AT: [number, number, number] = [0, 1, 0]

export function GameScene() {
  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[SKY_BLUE]} />
      <fogExp2 attach="fog" args={[SKY_BLUE, 0.02]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />

      <Suspense fallback={null}>
        <MovementArea />
      </Suspense>
    </Canvas>
  )
}
