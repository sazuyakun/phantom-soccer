import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"

import { GameState } from "../logic"
import { MovementArea } from "./environment/MovementArea"
import { PlayerBlob } from "./players/PlayerBlob"

const SKY_BLUE = "#87ceeb"

// The camera is fixed: it never moves, everything moves in front of it.
// Low and almost level with the ground so the floor runs out to the horizon.
const CAMERA_POSITION: [number, number, number] = [0, 2.5, 8]
const CAMERA_LOOK_AT: [number, number, number] = [0, 1, 0]

export function GameScene({ game }: { game: GameState }) {
  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 90 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[SKY_BLUE]} />

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
    </Canvas>
  )
}
