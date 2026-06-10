import type { PlayerId, RuneClient } from "rune-sdk"

import { Character } from "./shared/types"

export interface GameState {
  characters: Character[]
}

// no actions yet — movement controls come next
type GameActions = Record<string, never>

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// spawn positions fan out left/right from the center of the field,
// facing the camera
function addCharacter(id: PlayerId, state: GameState) {
  const index = state.characters.length
  const offset = Math.ceil(index / 2) * 2 * (index % 2 === 0 ? 1 : -1)

  state.characters.push({
    id,
    position: { x: offset, y: 0, z: 0 },
    angle: 0,
  })
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 6,
  landscape: true,
  setup: (allPlayerIds) => {
    const state: GameState = { characters: [] }

    for (const id of allPlayerIds) {
      addCharacter(id, state)
    }
    return state
  },
  events: {
    playerJoined: (playerId, { game }) => {
      addCharacter(playerId, game)
    },
    playerLeft: (playerId, { game }) => {
      game.characters = game.characters.filter((c) => c.id !== playerId)
    },
  },
  actions: {},
})
