"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Stars, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollStore";

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// Procedural "screen UI" so devices read as a real laptop/app, not a colour block.
function makeScreenTexture(kind: "web" | "app"): THREE.CanvasTexture {
  const w = kind === "web" ? 640 : 360;
  const h = kind === "web" ? 400 : 720;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const pad = w * 0.07;

  // background
  const bg = g.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#0e1230");
  bg.addColorStop(1, "#08081a");
  g.fillStyle = bg;
  g.fillRect(0, 0, w, h);

  // top bar
  g.fillStyle = "#2f7bff";
  roundRect(g, pad, pad, w * 0.34, h * 0.045, 8);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.15)";
  roundRect(g, w - pad - w * 0.12, pad, w * 0.12, h * 0.045, 8);
  g.fill();

  if (kind === "web") {
    // hero card
    const hero = g.createLinearGradient(pad, 0, w - pad, 0);
    hero.addColorStop(0, "rgba(47,123,255,0.5)");
    hero.addColorStop(1, "rgba(178,59,255,0.5)");
    g.fillStyle = hero;
    roundRect(g, pad, h * 0.14, w - pad * 2, h * 0.24, 14);
    g.fill();
    // three cards
    for (let i = 0; i < 3; i++) {
      g.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(g, pad + i * ((w - pad * 2) / 3), h * 0.44, (w - pad * 2) / 3 - 12, h * 0.16, 10);
      g.fill();
    }
    // chart line
    g.strokeStyle = "#37c6ff";
    g.lineWidth = 4;
    g.beginPath();
    const cy = h * 0.78;
    for (let i = 0; i <= 10; i++) {
      const x = pad + (i / 10) * (w - pad * 2);
      const y = cy - Math.sin(i * 0.9) * h * 0.06 - (i / 10) * h * 0.05;
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.stroke();
  } else {
    // balance card
    const bal = g.createLinearGradient(pad, 0, w - pad, 0);
    bal.addColorStop(0, "rgba(47,123,255,0.55)");
    bal.addColorStop(1, "rgba(178,59,255,0.55)");
    g.fillStyle = bal;
    roundRect(g, pad, h * 0.12, w - pad * 2, h * 0.18, 16);
    g.fill();
    // 2 stat tiles
    for (let i = 0; i < 2; i++) {
      g.fillStyle = "rgba(255,255,255,0.07)";
      roundRect(g, pad + i * ((w - pad * 2) / 2 + 6), h * 0.34, (w - pad * 2) / 2 - 6, h * 0.12, 12);
      g.fill();
    }
    // list rows
    for (let i = 0; i < 4; i++) {
      g.fillStyle = "rgba(255,255,255,0.05)";
      roundRect(g, pad, h * 0.5 + i * h * 0.1, w - pad * 2, h * 0.075, 10);
      g.fill();
      g.fillStyle = i % 2 ? "#b23bff" : "#37c6ff";
      g.beginPath();
      g.arc(pad + h * 0.04, h * 0.5 + i * h * 0.1 + h * 0.037, h * 0.02, 0, Math.PI * 2);
      g.fill();
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

// Ramp helper: 0 before `a`, up to 1 by `b`, hold, down to 0 by `d`.
function band(p: number, a: number, b: number, c: number, d: number) {
  if (p < a || p > d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p > c) return 1 - (p - c) / (d - c);
  return 1;
}
const damp = (cur: number, target: number, k: number) => cur + (target - cur) * k;

function setOpacity(group: THREE.Object3D | null, o: number) {
  if (!group) return;
  group.visible = o > 0.01;
  group.traverse((child) => {
    const m = (child as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!m) return;
    (Array.isArray(m) ? m : [m]).forEach((mat) => {
      mat.transparent = true;
      (mat as THREE.MeshStandardMaterial).opacity = o;
    });
  });
}

export default function Journey() {
  const { camera } = useThree();
  const p = useRef(0);
  const webTex = useMemo(() => makeScreenTexture("web"), []);
  const appTex = useMemo(() => makeScreenTexture("app"), []);

  const rig = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const laptop = useRef<THREE.Group>(null);
  const phones = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Group>(null);
  const moon = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    const k = Math.min(1, dt * 3);
    p.current = damp(p.current, scrollState.progress, k);
    const prog = p.current;
    const t = state.clock.elapsedTime;

    // Cinematic camera: travels closer, sways horizontally, subtle depth + parallax.
    const swayX = Math.sin(prog * Math.PI * 2) * 0.9 + scrollState.mouseX * 0.5;
    const swayY = 0.25 + Math.cos(prog * Math.PI) * 0.35 - scrollState.mouseY * 0.4;
    const zoom = 7.4 - prog * 2.6;
    camera.position.x = damp(camera.position.x, swayX, 0.05);
    camera.position.y = damp(camera.position.y, swayY, 0.05);
    camera.position.z = damp(camera.position.z, zoom, 0.05);
    camera.lookAt(0, 0, -2);

    // Rings rotate opposite directions
    if (ring1.current) ring1.current.rotation.z = t * 0.06;
    if (ring2.current) ring2.current.rotation.z = -t * 0.09;

    // Phase objects fade with scroll (web zone -> app zone -> CTA planet)
    if (laptop.current) {
      const o = band(prog, 0, 0.06, 0.32, 0.44);
      setOpacity(laptop.current, o);
      laptop.current.rotation.y = -0.5 + prog * 1.6;
      laptop.current.position.y = Math.sin(t * 0.6) * 0.1;
    }
    if (phones.current) {
      const o = band(prog, 0.42, 0.52, 0.72, 0.82);
      setOpacity(phones.current, o);
      phones.current.rotation.y = t * 0.15 + scrollState.mouseX * 0.2;
      phones.current.children.forEach((c, i) => {
        c.position.y = Math.sin(t * 0.7 + i) * 0.12;
      });
    }
    if (planet.current) {
      const o = band(prog, 0.78, 0.9, 1.01, 1.2);
      setOpacity(planet.current, o);
      const s = 0.7 + o * 0.6;
      planet.current.scale.setScalar(s);
      planet.current.rotation.y = t * 0.1;
    }
    if (moon.current) moon.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={rig}>
      <ambientLight intensity={0.5} />
      <pointLight position={[6, 5, 6]} intensity={2.2} color="#2f7bff" />
      <pointLight position={[-6, -3, 3]} intensity={2.2} color="#b23bff" />

      <Stars radius={70} depth={45} count={1600} factor={4} saturation={0} fade speed={0.5} />

      {/* Ambient orbital rings around the origin */}
      <mesh ref={ring1} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[3.4, 0.012, 12, 140]} />
        <meshBasicMaterial color="#2f7bff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <torusGeometry args={[4.3, 0.01, 12, 160]} />
        <meshBasicMaterial color="#b23bff" transparent opacity={0.4} />
      </mesh>

      {/* WEB zone: floating laptop */}
      <group ref={laptop} position={[2.3, 0, -1.5]} scale={1.1}>
        {/* screen */}
        <group position={[0, 0.5, 0]} rotation={[-0.35, 0, 0]}>
          <RoundedBox args={[2.2, 1.35, 0.06]} radius={0.05} smoothness={3}>
            <meshStandardMaterial color="#0b0b1e" metalness={0.7} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[2.02, 1.18]} />
            <meshBasicMaterial map={webTex} toneMapped={false} />
          </mesh>
        </group>
        {/* base */}
        <mesh position={[0, -0.18, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.3, 1.5, 0.07]} />
          <meshStandardMaterial color="#15152e" metalness={0.8} roughness={0.35} />
        </mesh>
      </group>

      {/* APP zone: two floating phones */}
      <group ref={phones} position={[2.2, 0, -1.5]}>
        {[-0.7, 0.7].map((x, i) => (
          <group key={i} position={[x, 0, i * -0.3]} rotation={[0, i ? -0.3 : 0.3, i ? 0.08 : -0.08]}>
            <RoundedBox args={[1, 2, 0.08]} radius={0.12} smoothness={4}>
              <meshStandardMaterial color="#0b0b1e" metalness={0.7} roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[0.86, 1.82]} />
              <meshBasicMaterial map={appTex} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* CTA planet */}
      <group ref={planet} position={[0, 0, -5]} visible={false}>
        <mesh>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial
            color="#3a2b8c"
            metalness={0.8}
            roughness={0.25}
            emissive="#2f1a6e"
            emissiveIntensity={0.5}
            flatShading
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[2.3, 0.05, 16, 120]} />
          <meshStandardMaterial color="#b23bff" emissive="#7a2bff" emissiveIntensity={1.3} />
        </mesh>
        <group ref={moon}>
          <mesh position={[2.3, 0, 0]}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color="#37c6ff" emissive="#2f7bff" emissiveIntensity={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
