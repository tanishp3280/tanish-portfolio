/** Normalize wheel devices and cap each gesture so a fast wheel cannot skip a story. */
export function scrubDelta(delta: number, mode = 0, viewport = 800) {
  if (!Number.isFinite(delta)) return 0;
  const pixels = delta * (mode === 1 ? 16 : mode === 2 ? viewport : 1);
  return Math.max(-.025, Math.min(.025, pixels * .00018));
}
