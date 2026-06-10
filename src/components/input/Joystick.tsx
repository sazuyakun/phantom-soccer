import nipplejs from "nipplejs"
import { useEffect, useRef } from "react"

import { LOGIC_FPS } from "../../shared/constants"

// joystick movement below this magnitude counts as not moving at all —
// without it the smallest touch causes motion
const DEAD_ZONE = 0.25
// report controls at most once per logic tick, and only on change —
// sending faster than the logic consumes them would be wasted actions
const SEND_INTERVAL = 1000 / LOGIC_FPS

/**
 * The on-screen movement joystick (bottom-left). Reads nipplejs and
 * reports view-space controls to the logic whenever they change.
 */
export function Joystick() {
  const zone = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const manager = nipplejs.create({
      mode: "static",
      zone: zone.current!,
      position: { left: "50%", top: "50%" },
      threshold: 0.2,
    })

    let current = { x: 0, y: 0 }

    manager.on("move", (evt) => {
      const { vector, force } = evt.data
      if (force < DEAD_ZONE) {
        current = { x: 0, y: 0 }
        return
      }
      // quantize so tiny tremors don't register as changed controls
      current = {
        x: Math.round(vector.x * 30) / 30,
        y: Math.round(vector.y * 30) / 30,
      }
    })
    manager.on("end", () => {
      current = { x: 0, y: 0 }
    })

    let lastSent = { x: 0, y: 0 }
    const interval = setInterval(() => {
      if (current.x !== lastSent.x || current.y !== lastSent.y) {
        Rune.actions.move(current)
        lastSent = current
      }
    }, SEND_INTERVAL)

    return () => {
      clearInterval(interval)
      manager.destroy()
    }
  }, [])

  return <div id="joystick" ref={zone} />
}
