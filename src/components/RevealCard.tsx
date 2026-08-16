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
      initial={{ opacity: 0, y: 44, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
