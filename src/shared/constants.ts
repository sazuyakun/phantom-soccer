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

// Players within this distance of the ball kick it.
export const KICK_RANGE = 0.9

// Kicked balls leave at the kicker's speed times this factor.
export const KICK_FACTOR = 1.4

// Fraction of ball velocity kept each logic tick (rolling friction).
export const BALL_FRICTION = 0.92
