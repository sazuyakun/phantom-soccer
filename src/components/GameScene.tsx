import { Canvas } from "@react-three/fiber"
import { PlayerId } from "rune-sdk"
import { Suspense } from "react"

import { GameState } from "../logic"
import { Ball } from "./Ball"
import { CameraRig } from "./CameraRig"
import { MovementArea } from "./environment/MovementArea"
import { PlayerCharacter } from "./players/PlayerCharacter"

const SKY_BLUE = "#87ceeb"

// Initial pose only — CameraRig takes over from the first frame.
const CAMERA_POSITION: [number, number, number] = [0, 2, 5.5]
const CAMERA_LOOK_AT: [number, number, number] = [0, 0.6, 0]

export function GameScene({
  game,
  yourPlayerId,
}: {
  game: GameState
  yourPlayerId: PlayerId | undefined
}) {
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
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <CameraRig targetId={yourPlayerId} />

      <Suspense fallback={null}>
        <group rotation-y={worldRotation}>
          <MovementArea />
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
