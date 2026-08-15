"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import Journey from "./Journey";

// Fixed full-viewport 3D backdrop that drives the scroll journey.
// Gated off for reduced-motion, small screens and missing WebGL so the site
// stays fast and fully usable without a GPU (spec: performance + accessibility).
export default function SceneCanvas() {
  const [enabled, setEnabled] = useState(false);
  const [dim, setDim] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    let webgl = false;
    try {
      webgl = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      webgl = false;
    }
    setEnabled(!reduce && !small && webgl);
  }, []);

  // Fade the fixed journey out over sections that bring their own 3D (Technology),
  // so the scene's devices don't collide with that section's content.
  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById("technology");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setDim(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-40 transition-opacity duration-700"
      style={{ opacity: dim ? 0 : 1 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.25, 7.4], fov: 45 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <Journey />
        </Suspense>
      </Canvas>
    </div>
  );
}
