import nipplejs from "nipplejs"
import { useEffect, useRef } from "react"

import { LOGIC_FPS } from "../../shared/constants"
import { flush, setStick } from "./controlsChannel"

const DEAD_ZONE = 0.25
const SEND_INTERVAL = 1000 / LOGIC_FPS

export function Joystick() {
  const zone = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const manager = nipplejs.create({
      mode: "static",
      zone: zone.current!,
      position: { left: "50%", top: "50%" },
      threshold: 0.2,
    })

    manager.on("move", (evt) => {
      const { vector, force } = evt.data
      if (force < DEAD_ZONE) {
        setStick(0, 0)
        return
      }
      setStick(Math.round(vector.x * 30) / 30, Math.round(vector.y * 30) / 30)
    })
    manager.on("end", () => {
      setStick(0, 0)
    })

    const interval = setInterval(flush, SEND_INTERVAL)

    return () => {
      clearInterval(interval)
      manager.destroy()
    }
  }, [])

  return <div id="joystick" ref={zone} />
}
