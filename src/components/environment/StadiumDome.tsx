import { DoubleSide } from "three"

import { STADIUM_RADIUS } from "../../shared/constants"

/**
 * Rocket League-style arena dome: a huge translucent hemisphere whose
 * rim meets the ground exactly at the stadium boundary.
 */
export function StadiumDome() {
  return (
    <group>
      <mesh>
        <sphereGeometry
          args={[STADIUM_RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#bcd9f0"
          transparent
          opacity={0.22}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* faint panel lines so the glass reads as a dome */}
      <mesh>
        <sphereGeometry
          args={[STADIUM_RADIUS, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
