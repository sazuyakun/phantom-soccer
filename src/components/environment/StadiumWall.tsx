import { DoubleSide } from "three"

import { STADIUM_RADIUS } from "../../shared/constants"

const WALL_HEIGHT = 1

/**
 * Low placeholder wall marking the circular stadium boundary,
 * to be replaced with real stadium geometry later.
 */
export function StadiumWall() {
  return (
    <mesh position-y={WALL_HEIGHT / 2}>
      <cylinderGeometry
        args={[STADIUM_RADIUS, STADIUM_RADIUS, WALL_HEIGHT, 64, 1, true]}
      />
      <meshStandardMaterial
        color="#dddddd"
        transparent
        opacity={0.4}
        side={DoubleSide}
      />
    </mesh>
  )
}
