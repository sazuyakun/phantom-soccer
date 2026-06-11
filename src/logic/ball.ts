import {
  BALL_AIR_DRAG,
  BALL_BOUNCE,
  BALL_FRICTION,
  BALL_RADIUS,
  BALL_REST_SPEED,
  GOAL_CENTER_Y,
  GOAL_RADIUS,
  GRAVITY,
  KICK_FACTOR,
  KICK_LIFT,
  KICK_RANGE,
  LOGIC_FPS,
  STADIUM_RADIUS,
} from "../shared/constants"
import { GameState } from "../shared/types"
import { scoreGoal } from "./match"

function applyKicks(game: GameState) {
  const { ball } = game

  for (const character of game.characters) {
    if (character.speed === 0 || character.position.y > 0) continue
    if (ball.position.y > 1.2) continue

    const dx = ball.position.x - character.position.x
    const dz = ball.position.z - character.position.z
    const distance = Math.sqrt(dx * dx + dz * dz)
    if (distance > KICK_RANGE || distance === 0) continue

    const kickSpeed = character.speed * KICK_FACTOR
    ball.velocity.x = (dx / distance) * kickSpeed
    ball.velocity.z = (dz / distance) * kickSpeed
    ball.velocity.y = kickSpeed * KICK_LIFT
  }
}

function applyGravity(game: GameState) {
  const { ball } = game
  if (ball.position.y === 0 && ball.velocity.y === 0) return

  ball.position.y += ball.velocity.y / LOGIC_FPS
  ball.velocity.y -= GRAVITY / LOGIC_FPS
  if (ball.position.y <= 0) {
    ball.position.y = 0
    const rebound = -ball.velocity.y * BALL_BOUNCE
    ball.velocity.y = rebound > BALL_REST_SPEED ? rebound : 0
  }
}

function collideFieldEdge(game: GameState): "goal" | undefined {
  const { ball } = game
  const limit = STADIUM_RADIUS - BALL_RADIUS
  const fromCenter = Math.sqrt(ball.position.x ** 2 + ball.position.z ** 2)
  if (fromCenter <= limit) return

  const centerY = ball.position.y + BALL_RADIUS
  const offCenter = Math.sqrt(
    ball.position.x ** 2 + (centerY - GOAL_CENTER_Y) ** 2
  )
  if (offCenter < GOAL_RADIUS - 0.3) {
    scoreGoal(game, ball.position.z > 0 ? 1 : -1)
    return "goal"
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

function applyDrag(game: GameState) {
  const { ball } = game
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

export function updateBall(game: GameState) {
  applyKicks(game)
  applyGravity(game)

  game.ball.position.x += game.ball.velocity.x / LOGIC_FPS
  game.ball.position.z += game.ball.velocity.z / LOGIC_FPS

  if (collideFieldEdge(game) === "goal") return
  applyDrag(game)
}
