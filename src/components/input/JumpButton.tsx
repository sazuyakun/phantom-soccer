import { queueJump } from "./controlsChannel"

export function JumpButton() {
  return (
    <button id="jump" onPointerDown={queueJump}>
      ▲
    </button>
  )
}
