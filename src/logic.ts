import type { PlayerId, RuneClient } from "rune-sdk"

import { LOGIC_FPS, MOVE_SPEED, MOVEMENT_AREA } from "./shared/constants"
import { Character, Controls } from "./shared/types"

export interface GameState {
  characters: Character[]
  // the latest controls reported by each player, applied every tick
  controls: Record<PlayerId, Controls>
}

type GameActions = {
  move: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

// how far from the center line each player spawns
const SPAWN_DISTANCE = 3

const MOVE_PER_TICK = MOVE_SPEED / LOGIC_FPS

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value))
}

// the two players spawn facing each other across the field; each
// client shows its own player on the near side (see GameScene)
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
    // apply each player's controls, converting from their view space
    // (joystick) to world space via the side they view the field from
    for (const character of game.characters) {
      const controls = game.controls[character.id]

      if (!controls || (controls.x === 0 && controls.y === 0)) {
        character.speed = 0
        continue
      }

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
      // face the direction of travel: the blob's face is on local +z,
      // and rotating +z by angle a around Y points it at (sin a, cos a)
      character.angle = Math.atan2(dx, dz)
      // record how fast we moved so the client can interpolate smoothly
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
