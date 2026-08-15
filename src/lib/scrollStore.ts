// Module-singleton scroll/mouse state. Written by SmoothScroll, read inside R3F
// useFrame loops WITHOUT triggering React re-renders (perf-critical).
export const scrollState = {
  progress: 0, // 0..1 down the whole page
  velocity: 0,
  mouseX: 0, // -1..1
  mouseY: 0,
};
