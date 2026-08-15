"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Cinematic "card arrives from depth" entrance: starts far in 3D space, moves
// toward the camera, rotates level and settles. Staggered via `delay`.
export default function RevealCard({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      initial={{ opacity: 0, y: 70, z: -160, rotateX: -14, scale: 0.9, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
