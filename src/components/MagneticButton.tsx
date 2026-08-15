"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Magnetic hover: the button eases toward the cursor, springs back on leave.
export default function MagneticButton({
  href,
  children,
  className = "btn btn-primary",
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span style={{ x, y }} className="inline-flex">
      {children}
    </motion.span>
  );

  const common = {
    ref,
    className,
    onMouseMove: onMove,
    onMouseLeave: reset,
  } as const;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...common}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} {...common}>
      {inner}
    </Link>
  );
}
