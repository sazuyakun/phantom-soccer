import type { RuneClient } from "rune-sdk"

import { updateBall } from "./logic/ball"
import { addCharacter, updateCharacters } from "./logic/characters"
import { generateObstacles } from "./logic/obstacles"
import { LOGIC_FPS } from "./shared/constants"
import { clamp } from "./shared/math"
import { Controls, GameState } from "./shared/types"

export type { GameState }

type GameActions = {
  move: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  landscape: true,
  updatesPerSecond: LOGIC_FPS,
  setup: (allPlayerIds) => {
    const state: GameState = {
      characters: [],
      controls: {},
      ball: { position: { x: 0, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
      obstacles: generateObstacles(allPlayerIds),
      scores: { near: 0, far: 0 },
    }

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
      delete game.controls[playerId]
    },
  },
  update: ({ game }) => {
    updateBall(game)
    updateCharacters(game)
  },
  actions: {
    move: (controls, { game, playerId }) => {
      game.controls[playerId] = {
        x: clamp(controls.x, 1),
        y: clamp(controls.y, 1),
        jump: controls.jump || game.controls[playerId]?.jump || false,
      }
    },
  },
})
