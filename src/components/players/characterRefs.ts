import { Group } from "three"

// The rendered (interpolated) scene node of each character, registered
// by PlayerBlob, so the camera rig can follow the local player smoothly.
export const characterRefs = new Map<string, Group>()
