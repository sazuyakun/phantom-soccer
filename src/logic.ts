import type { PlayerId, RuneClient } from "rune-sdk"

import {
  BALL_AIR_DRAG,
  BALL_BOUNCE,
  BALL_FRICTION,
  BALL_RADIUS,
  BALL_REST_SPEED,
  GOAL_CENTER_Y,
  GOAL_RADIUS,
  GOALS_TO_WIN,
  GRAVITY,
  JUMP_SPEED,
  KICK_FACTOR,
  KICK_LIFT,
  KICK_RANGE,
  LOGIC_FPS,
  MOVE_SPEED,
  STADIUM_RADIUS,
} from "./shared/constants"
import { Ball, Character, Controls, isAirborne } from "./shared/types"

export interface GameState {
  characters: Character[]
  controls: Record<PlayerId, Controls>
  ball: Ball
  // goals scored by the player on each side
  scores: { near: number; far: number }
}

type GameActions = {
  move: (controls: Controls) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

const SPAWN_DISTANCE = 6
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

// after a goal everyone returns to kickoff positions
function resetPositions(game: GameState) {
  game.ball.position = { x: 0, y: 0, z: 0 }
  game.ball.velocity = { x: 0, y: 0, z: 0 }
  for (const character of game.characters) {
    character.position = { x: 0, y: 0, z: character.side * SPAWN_DISTANCE }
    character.angle = character.side === 1 ? Math.PI : 0
    character.speed = 0
    character.velocityY = 0
  }
}

// the ring on your home side is the one your opponent scores in
function scoreGoal(game: GameState, ringSide: 1 | -1) {
  if (ringSide === 1) game.scores.far++
  else game.scores.near++
  resetPositions(game)

  const winnerSide =
    game.scores.near >= GOALS_TO_WIN
      ? 1
      : game.scores.far >= GOALS_TO_WIN
        ? -1
        : 0
  if (winnerSide !== 0) {
    Rune.gameOver({
      players: Object.fromEntries(
        game.characters.map((c) => [
          c.id,
          c.side === winnerSide ? "WON" : "LOST",
        ])
      ),
    })
  }
}

function updateBall(game: GameState) {
  const { ball } = game

  // a moving, grounded player in kick range sends the ball flying away
  for (const character of game.characters) {
    if (character.speed === 0 || character.position.y > 0) continue
    if (ball.position.y > 1.2) continue // too high to reach

    const dx = ball.position.x - character.position.x
    const dz = ball.position.z - character.position.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    if (distance > KICK_RANGE || distance === 0) continue

    const kickSpeed = character.speed * KICK_FACTOR
    ball.velocity.x = (dx / distance) * kickSpeed
    ball.velocity.z = (dz / distance) * kickSpeed
    ball.velocity.y = kickSpeed * KICK_LIFT
  }

  // vertical flight with gravity and ground bounces
  if (ball.position.y > 0 || ball.velocity.y !== 0) {
    ball.position.y += ball.velocity.y / LOGIC_FPS
    ball.velocity.y -= GRAVITY / LOGIC_FPS
    if (ball.position.y <= 0) {
      ball.position.y = 0
      // settle when the rebound would be weak — judging the impact speed
      // instead lets clamp-to-floor energy sustain bounces forever
      const rebound = -ball.velocity.y * BALL_BOUNCE
      ball.velocity.y = rebound > BALL_REST_SPEED ? rebound : 0
    }
  }

  ball.position.x += ball.velocity.x / LOGIC_FPS
  ball.position.z += ball.velocity.z / LOGIC_FPS

  // reaching the field edge: a goal if inside a ring, otherwise bounce
  const limit = STADIUM_RADIUS - BALL_RADIUS
  const fromCenter = Math.sqrt(ball.position.x ** 2 + ball.position.z ** 2)
  if (fromCenter > limit) {
    const centerY = ball.position.y + BALL_RADIUS
    const offCenter = Math.sqrt(
      ball.position.x ** 2 + (centerY - GOAL_CENTER_Y) ** 2
    )
    if (offCenter < GOAL_RADIUS - 0.3) {
      scoreGoal(game, ball.position.z > 0 ? 1 : -1)
      return
    }

    const nx = ball.position.x / fromCenter
    const nz = ball.position.z / fromCenter
    ball.position.x = nx * limit
    ball.position.z = nz * limit
    const outward = ball.velocity.x * nx + ball.velocity.z * nz
    if (outward > 0) {
      ball.velocity.x = (ball.velocity.x - 2 * outward * nx) * 0.7
      ball.velocity.z = (ball.velocity.z - 2 * outward * nz) * 0.7
    }
  }

  const drag = ball.position.y > 0 ? BALL_AIR_DRAG : BALL_FRICTION
  ball.velocity.x *= drag
  ball.velocity.z *= drag
  if (
    ball.position.y === 0 &&
    Math.abs(ball.velocity.x) + Math.abs(ball.velocity.z) < 0.1
  ) {
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
      ball: { position: { x: 0, y: 0, z: 0 }, velocity: { x: 0, y: 0, z: 0 } },
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

      character.position.x += dx
      character.position.z += dz

      // stay inside the circular stadium
      const fromCenter = Math.sqrt(
        character.position.x ** 2 + character.position.z ** 2
      )
      const limit = STADIUM_RADIUS - 0.5
      if (fromCenter > limit) {
        character.position.x *= limit / fromCenter
        character.position.z *= limit / fromCenter
      }

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
