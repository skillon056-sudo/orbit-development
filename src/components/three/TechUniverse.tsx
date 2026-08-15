"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollStore";

type Node = { name: string; pos: [number, number, number]; color: string };

const NODES: Node[] = [
  { name: "React", pos: [-3, 1.2, 0], color: "#37c6ff" },
  { name: "Next.js", pos: [-1.2, 2, -1], color: "#ffffff" },
  { name: "Node.js", pos: [1.4, 1.6, 0.6], color: "#7be04f" },
  { name: "TypeScript", pos: [3, 0.6, -0.5], color: "#2f7bff" },
  { name: "PostgreSQL", pos: [2.2, -1.4, 0.4], color: "#37c6ff" },
  { name: "Tailwind CSS", pos: [0, -2, -0.8], color: "#37c6ff" },
  { name: "Flutter", pos: [-2.2, -1.3, 0.5], color: "#2f7bff" },
  { name: "React Native", pos: [-3.2, -0.2, -0.6], color: "#b23bff" },
];

// connect in a loop + a few cross links = a network, not a ring
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
  [1, 4], [2, 6], [0, 3], [5, 7],
];

function Network() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = t * 0.12 + scrollState.mouseX * 0.35;
    group.current.rotation.x = scrollState.mouseY * 0.2;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#2f7bff" />
      <pointLight position={[-4, -3, 2]} intensity={2} color="#b23bff" />

      {LINKS.map(([a, b], i) => (
        <Line key={i} points={[NODES[a].pos, NODES[b].pos]} color="#3a2a8c" lineWidth={0.7} />
      ))}

      {NODES.map((n) => (
        <group key={n.name} position={n.pos}>
          <mesh>
            <icosahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.8} flatShading />
          </mesh>
          <Html center distanceFactor={9} position={[0, 0.5, 0]}>
            <div className="pointer-events-none select-none whitespace-nowrap rounded-md border border-line bg-black/60 px-2 py-1 text-[11px] font-semibold text-white/85 backdrop-blur">
              {n.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// Mount the canvas only once the section scrolls into view.
export default function TechUniverse() {
  const wrap = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // keep the static fallback
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="relative h-[360px] w-full md:h-[440px]">
      {show ? (
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
          <Network />
        </Canvas>
      ) : (
        // Static fallback (reduced-motion / not yet visible): readable chip cloud
        <div className="flex h-full flex-wrap content-center items-center justify-center gap-3">
          {NODES.map((n) => (
            <span key={n.name} className="chip text-sm" style={{ color: n.color }}>
              {n.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
