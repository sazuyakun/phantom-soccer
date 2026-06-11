// Pure data shared between client and logic — no three.js here.

// Playable area in world units: x along the landscape axis, z toward camera.
export const MOVEMENT_AREA = {
  width: 24,
  depth: 16,
} as const

// Logic tick rate; the client interpolates in between.
export const LOGIC_FPS = 10

// Player move speed, world units per second.
export const MOVE_SPEED = 10

// Initial upward velocity of a jump, units/sec.
export const JUMP_SPEED = 5

// Downward acceleration, units/sec².
export const GRAVITY = 15
