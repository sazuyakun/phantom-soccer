// Pure data shared between logic and client — no three.js here.
import type { PlayerId } from "rune-sdk"

export type Vec3 = {
  x: number
  y: number
  z: number
}

// Joystick state in the player's view space: x right, y forward.
// jump is consumed by the logic on takeoff.
export type Controls = {
  x: number
  y: number
  jump: boolean
}

export type Character = {
  id: string
  position: Vec3
  // radians around Y: 0 faces +z, a points the face at (sin a, cos a)
  angle: number
  // home side: 1 = first joiner (near camera, +z), -1 = second (far, -z)
  side: 1 | -1
  // speed at the last logic tick, units/sec — the client interpolates with it
  speed: number
  // vertical velocity in units/sec while jumping or falling
  velocityY: number
}

// single definition of "off the ground", shared by physics and animation
export function isAirborne(character: Character) {
  return character.position.y > 0 || character.velocityY !== 0
}

// A round obstacle on the field; players can't walk through it and
// low balls bounce off it.
export type Obstacle = {
  x: number
  z: number
  radius: number
}

export type Ball = {
  // position.y is elevation above resting height (0 = on the ground);
  // the client adds the ball radius when rendering
  position: Vec3
  // velocity in units/sec; kicks launch the ball with upward velocity
  velocity: Vec3
}

export interface GameState {
  characters: Character[]
  controls: Record<PlayerId, Controls>
  ball: Ball
  obstacles: Obstacle[]
  // goals scored by the player on each side
  scores: { near: number; far: number }
}
