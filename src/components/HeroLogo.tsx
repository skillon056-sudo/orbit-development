"use client";
import { motion } from "framer-motion";
import Emblem from "./Emblem";

// Animated brand visual for the hero: floating Orbit emblem wrapped by two
// counter-rotating orbital rings, orbiting dots and a soft glow. Pure SVG/CSS —
// lightweight, no 3D. Respects reduced-motion via framer-motion defaults.
export default function HeroLogo() {
  return (
    <div className="relative grid h-full place-items-center">
      {/* soft glow */}
      <motion.div
        className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(120,43,255,0.4),transparent_70%)] blur-2xl md:h-80 md:w-80"
        animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* outer orbital ring — slow clockwise */}
      <motion.div
        className="absolute"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <svg width="440" height="440" viewBox="0 0 440 440" className="max-w-[86vw]">
          <defs>
            <linearGradient id="hl_r1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2f7bff" />
              <stop offset="1" stopColor="#b23bff" />
            </linearGradient>
          </defs>
          <ellipse
            cx="220" cy="220" rx="205" ry="86"
            fill="none" stroke="url(#hl_r1)" strokeWidth="2.5"
            strokeDasharray="4 12" strokeLinecap="round"
            transform="rotate(-18 220 220)" opacity="0.85"
          />
          {/* dot riding the ring */}
          <circle cx="220" cy="134" r="7" fill="#37c6ff" transform="rotate(-18 220 220)" />
        </svg>
      </motion.div>

      {/* inner orbital ring — faster counter-clockwise */}
      <motion.div
        className="absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg width="330" height="330" viewBox="0 0 330 330" className="max-w-[70vw]">
          <ellipse
            cx="165" cy="165" rx="150" ry="60"
            fill="none" stroke="#b23bff" strokeWidth="2"
            strokeDasharray="2 10" strokeLinecap="round"
            transform="rotate(22 165 165)" opacity="0.6"
          />
          <circle cx="165" cy="105" r="5" fill="#b23bff" transform="rotate(22 165 165)" />
        </svg>
      </motion.div>

      {/* floating emblem */}
      <motion.div
        className="relative w-[260px] max-w-[70%] md:w-[300px]"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Emblem className="w-full drop-shadow-[0_20px_60px_rgba(120,43,255,0.55)]" />
      </motion.div>
    </div>
  );
}
