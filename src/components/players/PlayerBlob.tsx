import { Character } from "../../shared/types"

// one color per player, picked by join order
const BLOB_COLORS = [
  "#e2574c",
  "#4c8be2",
  "#e2b34c",
  "#9b59b6",
  "#1abc9c",
  "#e67ee2",
]

/**
 * Placeholder player: a blob with a face and hands, built from
 * primitives. The whole component gets swapped for a glTF model later —
 * its interface (a Character to render) stays the same.
 */
export function PlayerBlob(props: {
  character: Character
  colorIndex: number
}) {
  const { character, colorIndex } = props
  const color = BLOB_COLORS[colorIndex % BLOB_COLORS.length]
  const { x, y, z } = character.position

  return (
    <group position={[x, y, z]} rotation-y={character.angle}>
      {/* body */}
      <mesh position-y={0.55}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.18, 0.72, 0.46]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
      <mesh position={[0.18, 0.72, 0.46]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial color="#222222" />
      </mesh>

      {/* mouth */}
      <mesh position={[0, 0.48, 0.51]}>
        <boxGeometry args={[0.22, 0.05, 0.05]} />
        <meshBasicMaterial color="#222222" />
      </mesh>

      {/* hands */}
      <mesh position={[-0.6, 0.45, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0.6, 0.45, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}
