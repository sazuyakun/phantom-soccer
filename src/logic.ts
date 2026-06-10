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

// how far from the center line each player spawns
const SPAWN_DISTANCE = 3

// the two players spawn facing each other across the field; each
// client shows its own player on the near side (see GameScene)
function addCharacter(id: PlayerId, state: GameState) {
  const side = state.characters.some((c) => c.side === 1) ? -1 : 1

  state.characters.push({
    id,
    position: { x: 0, y: 0, z: side * SPAWN_DISTANCE },
    angle: side === 1 ? Math.PI : 0,
    side,
  })
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
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
