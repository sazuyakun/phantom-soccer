import { Canvas } from "@react-three/fiber"

import { MovementArea } from "./environment/MovementArea"

// The camera is fixed: it never moves, everything moves in front of it.
// Elevated and tilted toward the play area, Brawl Stars style.
const CAMERA_POSITION: [number, number, number] = [0, 16, 12]

export function GameScene() {
  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 45 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <color attach="background" args={["#87ceeb"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} />

      <MovementArea />
    </Canvas>
  )
}
