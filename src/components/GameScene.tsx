import { Canvas } from "@react-three/fiber"
import { PlayerId } from "rune-sdk"
import { Suspense } from "react"

import { GameState } from "../logic"
import { MovementArea } from "./environment/MovementArea"
import { PlayerBlob } from "./players/PlayerBlob"

const SKY_BLUE = "#87ceeb"

// The camera is fixed: it never moves, everything moves in front of it.
// Low and almost level with the ground so the floor runs out to the horizon.
const CAMERA_POSITION: [number, number, number] = [0, 2.5, 8]
const CAMERA_LOOK_AT: [number, number, number] = [0, 1, 0]

export function GameScene(props: {
  game: GameState
  yourPlayerId: PlayerId | undefined
}) {
  const { game, yourPlayerId } = props

  // Each phone views the field from its own player's side. The camera
  // never moves — instead the world is rotated 180° for the player who
  // spawned on the far side, putting their character nearest the camera.
  const you = game.characters.find((c) => c.id === yourPlayerId)
  const worldRotation = you?.side === -1 ? Math.PI : 0

  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 90 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[SKY_BLUE]} />

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
