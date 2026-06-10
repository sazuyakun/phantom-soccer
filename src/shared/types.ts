// Pure data types shared between logic and client. No three.js here —
// the logic bundle must stay deterministic and small.

export type Vec3 = {
  x: number
  y: number
  z: number
}

// The logic-side representation of a player's character in the world.
export type Character = {
  // the player ID, kept as string to allow non-player characters later
  id: string
  position: Vec3
  // rotation around the Y axis the character is facing
  angle: number
}
