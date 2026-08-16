"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { scrollState } from "@/lib/scrollStore";

// Lenis smooth scroll + publishes global scroll/mouse state for the 3D scene.
// Disabled entirely under prefers-reduced-motion (native scroll, no smoothing).
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Native scroll on touch/small screens — Lenis fights the OS scroll there and feels laggy.
    const touch = window.matchMedia("(max-width: 900px)").matches || "ontouchstart" in window;
    let lenis: Lenis | undefined;
    let rafId = 0;

    if (!reduce && !touch) {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const raf = (t: number) => {
        lenis!.raf(t);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    let lastY = window.scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? window.scrollY / max : 0;
      scrollState.velocity = window.scrollY - lastY;
      lastY = window.scrollY;
    };
    const onMove = (e: MouseEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      scrollState.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <>{children}</>;
}
