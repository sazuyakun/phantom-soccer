// Pure data types shared between logic and client. No three.js here —
// the logic bundle must stay deterministic and small.

export type Vec3 = {
  x: number
  y: number
  z: number
}

// The joystick state a player reports to the logic, in their own view
// space: x is screen right, y is screen forward (away from the camera).
export type Controls = {
  x: number
  y: number
}

// The logic-side representation of a player's character in the world.
export type Character = {
  // the player ID, kept as string to allow non-player characters later
  id: string
  position: Vec3
  // rotation around the Y axis the character is facing
  angle: number
  // which side of the field the player calls home (1 = near the
  // default camera, -1 = far); each client views from its own side
  side: 1 | -1
  // how fast the logic moved this character at its last tick, in units
  // per second — the client interpolates toward position at this speed
  speed: number
}
