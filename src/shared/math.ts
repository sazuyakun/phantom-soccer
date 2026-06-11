export function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value))
}
