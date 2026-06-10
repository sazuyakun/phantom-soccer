import { FIELD } from "../../constants"

const LINE_WIDTH = 0.15
const LINE_Y = 0.01 // lift markings slightly above the grass to avoid z-fighting
const STRIPE_COUNT = 10
const STRIPE_LENGTH = FIELD.length / STRIPE_COUNT
const PENALTY_BOX = { depth: 4, width: 10 }

/** A flat white line on the ground, centered at (x, z). */
function Line(props: {
  x?: number
  z?: number
  length: number
  width: number
}) {
  const { x = 0, z = 0, length, width } = props

  return (
    <mesh position={[x, LINE_Y, z]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[length, width]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

/** Penalty box outline at one end of the pitch (side: -1 = left, 1 = right). */
function PenaltyBox({ side }: { side: -1 | 1 }) {
  const edgeX = (side * FIELD.length) / 2
  const frontX = edgeX - side * PENALTY_BOX.depth

  return (
    <group>
      <Line x={frontX} length={LINE_WIDTH} width={PENALTY_BOX.width} />
      <Line
        x={(edgeX + frontX) / 2}
        z={-PENALTY_BOX.width / 2}
        length={PENALTY_BOX.depth}
        width={LINE_WIDTH}
      />
      <Line
        x={(edgeX + frontX) / 2}
        z={PENALTY_BOX.width / 2}
        length={PENALTY_BOX.depth}
        width={LINE_WIDTH}
      />
    </group>
  )
}

/**
 * Non-interactable environment: a flat football pitch with mowing stripes
 * and standard markings. Static geometry only — never re-renders.
 */
export function Field() {
  return (
    <group>
      {/* Out-of-bounds apron under everything */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <planeGeometry args={[FIELD.length + 8, FIELD.width + 8]} />
        <meshStandardMaterial color="#1e6b24" />
      </mesh>

      {/* Alternating grass stripes */}
      {Array.from({ length: STRIPE_COUNT }, (_, i) => (
        <mesh
          key={i}
          rotation-x={-Math.PI / 2}
          position-x={-FIELD.length / 2 + STRIPE_LENGTH * (i + 0.5)}
        >
          <planeGeometry args={[STRIPE_LENGTH, FIELD.width]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#2e8b32" : "#37a23c"} />
        </mesh>
      ))}

      {/* Touchlines and goal lines */}
      <Line z={-FIELD.width / 2} length={FIELD.length} width={LINE_WIDTH} />
      <Line z={FIELD.width / 2} length={FIELD.length} width={LINE_WIDTH} />
      <Line x={-FIELD.length / 2} length={LINE_WIDTH} width={FIELD.width} />
      <Line x={FIELD.length / 2} length={LINE_WIDTH} width={FIELD.width} />

      {/* Halfway line, center circle and center spot */}
      <Line length={LINE_WIDTH} width={FIELD.width} />
      <mesh position-y={LINE_Y} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[3 - LINE_WIDTH / 2, 3 + LINE_WIDTH / 2, 64]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position-y={LINE_Y} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="white" />
      </mesh>

      <PenaltyBox side={-1} />
      <PenaltyBox side={1} />
    </group>
  )
}
