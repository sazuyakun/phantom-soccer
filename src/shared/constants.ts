// Pure data shared between client and logic — no three.js imports allowed
// here so that logic.ts stays deterministic and small.

// Size of the area players can move around in, in world units.
// x runs along the long (landscape) axis, z toward the camera.
export const MOVEMENT_AREA = {
  width: 24,
  depth: 16,
} as const
