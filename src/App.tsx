import { useEffect, useState } from "react"

import { GameScene } from "./components/GameScene"
import { GameState } from "./logic.ts"

function App() {
  const [game, setGame] = useState<GameState>()

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game }) => {
        setGame(game)
      },
    })
  }, [])

  if (!game) {
    // Rune only shows your game after an onChange() so no need for loading screen
    return
  }

  return <GameScene />
}

export default App
