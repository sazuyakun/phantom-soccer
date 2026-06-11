import { Controls } from "../../shared/types"

// Single send path for all inputs: the joystick writes the stick state
// and flushes on an interval; jump flushes immediately for responsiveness.
const current: Controls = { x: 0, y: 0, jump: false }
let lastSent: Controls = { x: 0, y: 0, jump: false }

export function setStick(x: number, y: number) {
  current.x = x
  current.y = y
}

export function queueJump() {
  current.jump = true
  flush()
}

export function flush() {
  if (current.x === lastSent.x && current.y === lastSent.y && !current.jump) {
    return
  }
  Rune.actions.move({ ...current })
  lastSent = { ...current }
  current.jump = false
}
