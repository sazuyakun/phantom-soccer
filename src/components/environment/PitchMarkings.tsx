import { GOAL_Z, STADIUM_RADIUS } from "../../shared/constants"

const LINE_WIDTH = 0.18
const LINE_Y = 0.02
const CENTER_CIRCLE_RADIUS = 4
const BOX = { width: 9, depth: 4.5 }

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

function KeeperBox({ side }: { side: 1 | -1 }) {
  const backZ = side * GOAL_Z
  const frontZ = side * (GOAL_Z - BOX.depth)
  const midZ = (backZ + frontZ) / 2

  return (
    <group>
      <Line z={frontZ} length={BOX.width} width={LINE_WIDTH} />
      <Line z={backZ} length={BOX.width} width={LINE_WIDTH} />
      <Line x={-BOX.width / 2} z={midZ} length={LINE_WIDTH} width={BOX.depth} />
      <Line x={BOX.width / 2} z={midZ} length={LINE_WIDTH} width={BOX.depth} />
    </group>
  )
}

export function PitchMarkings() {
  return (
    <group>
      <mesh position-y={LINE_Y} rotation-x={-Math.PI / 2}>
        <ringGeometry
          args={[STADIUM_RADIUS - LINE_WIDTH, STADIUM_RADIUS + LINE_WIDTH, 96]}
        />
        <meshBasicMaterial color="white" />
      </mesh>

      <mesh position-y={LINE_Y} rotation-x={-Math.PI / 2}>
        <ringGeometry
          args={[
            CENTER_CIRCLE_RADIUS - LINE_WIDTH / 2,
            CENTER_CIRCLE_RADIUS + LINE_WIDTH / 2,
            64,
          ]}
        />
        <meshBasicMaterial color="white" />
      </mesh>

      <KeeperBox side={1} />
      <KeeperBox side={-1} />
    </group>
  )
}
