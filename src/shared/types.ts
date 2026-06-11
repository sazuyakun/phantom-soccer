import type { PlayerId } from "rune-sdk"

export type Vec3 = {
  x: number
  y: number
  z: number
}

export type Controls = {
  x: number
  y: number
  jump: boolean
}

export type Character = {
  id: string
  position: Vec3
  angle: number
  side: 1 | -1
  speed: number
  velocityY: number
}

export function isAirborne(character: Character) {
  return character.position.y > 0 || character.velocityY !== 0
}

export type Ball = {
  position: Vec3
  velocity: Vec3
}

export interface GameState {
  characters: Character[]
  controls: Record<PlayerId, Controls>
  ball: Ball
  scores: { near: number; far: number }
}
