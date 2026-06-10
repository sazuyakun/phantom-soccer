import { MOVEMENT_AREA } from "../../shared/constants"

/**
 * Non-interactable environment: the plain, flat ground players move
 * around on. Static geometry, never re-renders.
 */
export function MovementArea() {
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[MOVEMENT_AREA.width, MOVEMENT_AREA.depth]} />
      <meshLambertMaterial color="#4caf50" />
    </mesh>
  )
}
