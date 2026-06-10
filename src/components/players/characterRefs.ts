import { Group } from "three"

// Rendered (interpolated) node per character, so the camera can follow one.
export const characterRefs = new Map<string, Group>()
