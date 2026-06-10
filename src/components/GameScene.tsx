import { Canvas } from "@react-three/fiber"

import { Field } from "./environment/Field"

// Fixed Brawl Stars-style camera: elevated, tilted toward the pitch, never moves.
const CAMERA_POSITION: [number, number, number] = [0, 22, 17]

export function GameScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: CAMERA_POSITION, fov: 40 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
    >
      <color attach="background" args={["#14501a"]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[10, 20, 10]} intensity={1.2} />

      <Field />
    </Canvas>
  )
}
