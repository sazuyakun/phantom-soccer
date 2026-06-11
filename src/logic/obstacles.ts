import type { PlayerId } from "rune-sdk"

import { GOAL_Z, OBSTACLE_COUNT, STADIUM_RADIUS } from "../shared/constants"
import { Obstacle } from "../shared/types"

// deterministic PRNG — logic must compute the same layout everywhere,
// so the seed comes from the match's player ids, never Math.random
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateObstacles(allPlayerIds: PlayerId[]): Obstacle[] {
  let seed = 1
  for (const ch of allPlayerIds.join("")) {
    seed = (seed * 31 + ch.charCodeAt(0)) | 0
  }
  const random = mulberry32(seed)

  const obstacles: Obstacle[] = []
  let attempts = 0
  while (obstacles.length < OBSTACLE_COUNT && attempts++ < 100) {
    const radius = 1.2 + random() * 0.8
    const angle = random() * Math.PI * 2
    const dist = 9 + random() * (STADIUM_RADIUS - 14)
    const x = Math.sin(angle) * dist
    const z = Math.cos(angle) * dist

    // keep the goal approaches clear
    if (Math.abs(x) < 5 && Math.abs(z) > GOAL_Z - 9) continue
    // keep rocks apart
    const tooClose = obstacles.some((o) => {
      const d = Math.sqrt((o.x - x) ** 2 + (o.z - z) ** 2)
      return d < o.radius + radius + 1.5
    })
    if (tooClose) continue

    obstacles.push({ x, z, radius })
  }
  return obstacles
}
