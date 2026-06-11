import { useEffect, useState } from "react"
import { PlayerId } from "rune-sdk"

import { GameScene } from "./components/GameScene"
import { Joystick } from "./components/input/Joystick"
import { JumpButton } from "./components/input/JumpButton"
import { GameState } from "./logic.ts"

function App() {
  const [game, setGame] = useState<GameState>()
  const [yourPlayerId, setYourPlayerId] = useState<PlayerId | undefined>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game)
        setYourPlayerId(yourPlayerId)
      },
    })
  }, [])

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  // your score reads first on your own phone
  const you = game.characters.find((c) => c.id === yourPlayerId)
  const scores =
    you?.side === -1
      ? [game.scores.far, game.scores.near]
      : [game.scores.near, game.scores.far]

  return (
    <>
      <GameScene game={game} yourPlayerId={yourPlayerId} />
      <div id="score">
        {scores[0]} — {scores[1]}
      </div>
      {/* spectators don't get controls */}
      {yourPlayerId && (
        <>
          <Joystick />
          <JumpButton />
        </>
      )}
    </>
  )
}

export default App
