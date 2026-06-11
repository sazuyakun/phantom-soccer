// Pure data shared between logic and client — no three.js here.

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
