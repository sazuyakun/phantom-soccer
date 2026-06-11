// Pure data shared between client and logic — no three.js here.

// Playable area in world units: x along the landscape axis, z toward camera.
export const MOVEMENT_AREA = {
  width: 48,
  depth: 32,
} as const

// Logic tick rate; the client interpolates in between.
export const LOGIC_FPS = 10

// Player move speed, world units per second.
export const MOVE_SPEED = 10

// Initial upward velocity of a jump, units/sec.
export const JUMP_SPEED = 5

// Downward acceleration, units/sec².
export const GRAVITY = 15

// The ball is deliberately oversized relative to the players.
export const BALL_RADIUS = 1.1

// Players within this distance of the ball's center kick it.
export const KICK_RANGE = BALL_RADIUS + 0.7

// Kicked balls leave at the kicker's speed times this factor.
export const KICK_FACTOR = 1.4

// Upward fraction of kick speed — kicks launch the ball into the air.
export const KICK_LIFT = 0.5

// Fraction of vertical speed kept when the ball bounces off the ground.
export const BALL_BOUNCE = 0.45

// Rebounds slower than this don't happen — the ball settles into a roll.
export const BALL_REST_SPEED = 2.5

// Fraction of ball velocity kept each logic tick (rolling friction).
export const BALL_FRICTION = 0.92

// Much weaker drag while the ball is airborne.
export const BALL_AIR_DRAG = 0.99
