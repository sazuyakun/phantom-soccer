// Pure data only — this file is imported by client components and, later,
// by logic.ts for movement bounds, so it must stay free of three.js imports.

/** Playable pitch size in world units (x = length, z = width). */
export const FIELD = {
  length: 30,
  width: 20,
} as const
