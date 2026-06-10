import { useEffect, useState } from "react"
import { PlayerId } from "rune-sdk"

import { GameScene } from "./components/GameScene"
import { Joystick } from "./components/input/Joystick"
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

  return (
    <>
      <GameScene game={game} yourPlayerId={yourPlayerId} />
      {/* spectators don't get controls */}
      {yourPlayerId && <Joystick />}
    </>
  )
}

export default App
