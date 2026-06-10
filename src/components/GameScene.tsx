import { Canvas } from "@react-three/fiber"
import { PlayerId } from "rune-sdk"
import { Suspense } from "react"

import { GameState } from "../logic"
import { CameraRig } from "./CameraRig"
import { MovementArea } from "./environment/MovementArea"
import { PlayerBlob } from "./players/PlayerBlob"

const SKY_BLUE = "#87ceeb"

// Initial pose only — CameraRig takes over from the first frame.
const CAMERA_POSITION: [number, number, number] = [0, 2, 5.5]
const CAMERA_LOOK_AT: [number, number, number] = [0, 0.6, 0]

export function GameScene(props: {
  game: GameState
  yourPlayerId: PlayerId | undefined
}) {
  const { game, yourPlayerId } = props

  // the world rotates 180° for the far-side player, so each phone
  // shows its own character nearest the camera
  const you = game.characters.find((c) => c.id === yourPlayerId)
  const worldRotation = you?.side === -1 ? Math.PI : 0

  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 90 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[SKY_BLUE]} />
      <CameraRig targetId={yourPlayerId} />

      <group rotation-y={worldRotation}>
        <Suspense fallback={null}>
          <MovementArea />
        </Suspense>

        {game.characters.map((character, index) => (
          <PlayerBlob
            key={character.id}
            character={character}
            colorIndex={index}
          />
        ))}
      </group>
    </Canvas>
  )
}
