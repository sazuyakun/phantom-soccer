import type { PlayerId } from "rune-sdk"

import {
  GRAVITY,
  JUMP_SPEED,
  LOGIC_FPS,
  MOVE_SPEED,
  STADIUM_RADIUS,
} from "../shared/constants"
import { GameState, isAirborne } from "../shared/types"

export const SPAWN_DISTANCE = 6
const MOVE_PER_TICK = MOVE_SPEED / LOGIC_FPS

export function addCharacter(id: PlayerId, state: GameState) {
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

export function updateCharacters(game: GameState) {
  for (const character of game.characters) {
    const controls = game.controls[character.id]

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

    const dx = character.side * controls.x * MOVE_PER_TICK
    const dz = -character.side * controls.y * MOVE_PER_TICK

    character.position.x += dx
    character.position.z += dz

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
      Math.sqrt(controls.x * controls.x + controls.y * controls.y) * MOVE_SPEED
  }
}
