import type { PlayerId, RuneClient } from "rune-sdk"

import { LOGIC_FPS, MOVE_SPEED, MOVEMENT_AREA } from "./shared/constants"
import { Character, Controls } from "./shared/types"

export interface GameState {
  characters: Character[]
  controls: Record<PlayerId, Controls>
}

type GameActions = {
  move: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

const SPAWN_DISTANCE = 3
const MOVE_PER_TICK = MOVE_SPEED / LOGIC_FPS

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value))
}

// players spawn facing each other; each client shows its own side near the camera
function addCharacter(id: PlayerId, state: GameState) {
  const side = state.characters.some((c) => c.side === 1) ? -1 : 1

  state.characters.push({
    id,
    position: { x: 0, y: 0, z: side * SPAWN_DISTANCE },
    angle: side === 1 ? Math.PI : 0,
    side,
    speed: 0,
  })
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  landscape: true,
  updatesPerSecond: LOGIC_FPS,
  setup: (allPlayerIds) => {
    const state: GameState = { characters: [], controls: {} }

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
    for (const character of game.characters) {
      const controls = game.controls[character.id]

      if (!controls || (controls.x === 0 && controls.y === 0)) {
        character.speed = 0
        continue
      }

      // controls are in the player's view space; their side maps it to world space
      const dx = character.side * controls.x * MOVE_PER_TICK
      const dz = -character.side * controls.y * MOVE_PER_TICK

      character.position.x = clamp(
        character.position.x + dx,
        MOVEMENT_AREA.width / 2
      )
      character.position.z = clamp(
        character.position.z + dz,
        MOVEMENT_AREA.depth / 2
      )
      character.angle = Math.atan2(dx, dz)
      character.speed =
        Math.sqrt(controls.x * controls.x + controls.y * controls.y) *
        MOVE_SPEED
    }
  },
  actions: {
    move: (controls, { game, playerId }) => {
      game.controls[playerId] = {
        x: clamp(controls.x, 1),
        y: clamp(controls.y, 1),
      }
    },
  },
})
