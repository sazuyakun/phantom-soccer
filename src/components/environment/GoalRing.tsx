import { DoubleSide } from "three"

import {
  GOAL_CENTER_Y,
  GOAL_COLORS,
  GOAL_RADIUS,
  GOAL_Z,
} from "../../shared/constants"

/**
 * Rocket League-style goal: a large ring floating just above the
 * ground at one end of the stadium. The ball flies through it.
 */
export function GoalRing({ side }: { side: 1 | -1 }) {
  return (
    <group position={[0, GOAL_CENTER_Y, side * GOAL_Z]}>
      <mesh>
        <torusGeometry args={[GOAL_RADIUS, 0.3, 12, 48]} />
        <meshStandardMaterial
          color={GOAL_COLORS[side]}
          emissive={GOAL_COLORS[side]}
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* tinted goal mouth so the dome doesn't show through the ring */}
      <mesh>
        <circleGeometry args={[GOAL_RADIUS, 48]} />
        <meshBasicMaterial
          color={GOAL_COLORS[side]}
          transparent
          opacity={0.4}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
