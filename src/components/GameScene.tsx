import { Canvas } from "@react-three/fiber"
import { PlayerId } from "rune-sdk"
import { Suspense } from "react"

import { GameState } from "../logic"
import { Ball } from "./Ball"
import { CameraRig } from "./CameraRig"
import { GoalRing } from "./environment/GoalRing"
import { MovementArea } from "./environment/MovementArea"
import { Obstacles } from "./environment/Obstacles"
import { PitchMarkings } from "./environment/PitchMarkings"
import { PlayerCharacter } from "./players/PlayerCharacter"

const SKY_BLUE = "#87ceeb"

const CAMERA_POSITION: [number, number, number] = [0, 2, 5.5]
const CAMERA_LOOK_AT: [number, number, number] = [0, 0.6, 0]

export function GameScene({
  game,
  yourPlayerId,
}: {
  game: GameState
  yourPlayerId: PlayerId | undefined
}) {
  const you = game.characters.find((c) => c.id === yourPlayerId)
  const worldRotation = you?.side === -1 ? Math.PI : 0

  return (
    <Canvas
      dpr={1}
      camera={{ position: CAMERA_POSITION, fov: 90 }}
      onCreated={({ camera }) => camera.lookAt(...CAMERA_LOOK_AT)}
    >
      <color attach="background" args={[SKY_BLUE]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <CameraRig targetId={yourPlayerId} />

      <Suspense fallback={null}>
        <group rotation-y={worldRotation}>
          <MovementArea />
          <PitchMarkings />
          <Obstacles obstacles={game.obstacles} />
          <GoalRing side={1} />
          <GoalRing side={-1} />
          <Ball ball={game.ball} />

          {game.characters.map((character, index) => (
            <PlayerCharacter
              key={character.id}
              character={character}
              modelIndex={index}
            />
          ))}
        </group>
      </Suspense>
    </Canvas>
  )
}
