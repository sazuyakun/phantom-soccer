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
  // facing rotation around the Y axis, in radians: 0 faces +z, and
  // rotating by a points the face at (sin a, cos a) on the x/z plane
  angle: number
  // which side of the field the player calls home: the first player to
  // join gets 1 (near the default camera, spawns at +z), the second -1
  // (far side, spawns at -z); each client views from its own side
  side: 1 | -1
  // how fast the logic moved this character at its last tick, in units
  // per second — the client interpolates toward position at this speed
  speed: number
}
