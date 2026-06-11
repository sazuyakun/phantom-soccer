import { GOAL_CENTER_Y, GOAL_RADIUS, GOAL_Z } from "../../shared/constants"

const RING_COLORS = { 1: "#3b82f6", [-1]: "#f97316" } as const

/**
 * Rocket League-style goal: a large ring floating just above the
 * ground at one end of the stadium. The ball flies through it.
 */
export function GoalRing({ side }: { side: 1 | -1 }) {
  return (
    <mesh position={[0, GOAL_CENTER_Y, side * GOAL_Z]}>
      <torusGeometry args={[GOAL_RADIUS, 0.3, 12, 48]} />
      <meshStandardMaterial
        color={RING_COLORS[side]}
        emissive={RING_COLORS[side]}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
