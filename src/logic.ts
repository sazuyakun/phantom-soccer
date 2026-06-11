import type { PlayerId, RuneClient } from "rune-sdk"

import {
  BALL_FRICTION,
  GRAVITY,
  JUMP_SPEED,
  KICK_FACTOR,
  KICK_RANGE,
  LOGIC_FPS,
  MOVE_SPEED,
  MOVEMENT_AREA,
} from "./shared/constants"
import { Ball, Character, Controls, isAirborne } from "./shared/types"

export interface GameState {
  characters: Character[]
  controls: Record<PlayerId, Controls>
  ball: Ball
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
    velocityY: 0,
  })
}

function updateBall(game: GameState) {
  const { ball } = game

  // a moving, grounded player in kick range sends the ball away from them
  for (const character of game.characters) {
    if (character.speed === 0 || character.position.y > 0) continue

    const dx = ball.position.x - character.position.x
    const dz = ball.position.z - character.position.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    if (distance > KICK_RANGE || distance === 0) continue

    const kickSpeed = character.speed * KICK_FACTOR
    ball.velocity.x = (dx / distance) * kickSpeed
    ball.velocity.z = (dz / distance) * kickSpeed
  }

  ball.position.x += ball.velocity.x / LOGIC_FPS
  ball.position.z += ball.velocity.z / LOGIC_FPS

  // bounce off the edges of the movement area, losing some pace
  const limitX = MOVEMENT_AREA.width / 2
  const limitZ = MOVEMENT_AREA.depth / 2
  if (Math.abs(ball.position.x) > limitX) {
    ball.position.x = clamp(ball.position.x, limitX)
    ball.velocity.x *= -0.7
  }
  if (Math.abs(ball.position.z) > limitZ) {
    ball.position.z = clamp(ball.position.z, limitZ)
    ball.velocity.z *= -0.7
  }

  ball.velocity.x *= BALL_FRICTION
  ball.velocity.z *= BALL_FRICTION
  if (Math.abs(ball.velocity.x) + Math.abs(ball.velocity.z) < 0.1) {
    ball.velocity.x = 0
    ball.velocity.z = 0
  }
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
      ball: { position: { x: 0, y: 0, z: 0 }, velocity: { x: 0, z: 0 } },
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

    for (const character of game.characters) {
      const controls = game.controls[character.id]

      // jump only from the ground; the flag is consumed so holding it
      // doesn't bunny-hop on landing
      if (controls?.jump && character.position.y === 0) {
        character.velocityY = JUMP_SPEED
        controls.jump = false
      }
      if (isAirborne(character)) {
        character.position.y = Math.max(
          0,
          character.position.y + character.velocityY / LOGIC_FPS
        )
        character.velocityY =
          character.position.y === 0
            ? 0
            : character.velocityY - GRAVITY / LOGIC_FPS
      }

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
        jump: controls.jump || game.controls[playerId]?.jump || false,
      }
    },
  },
})
