"use client";
import { motion } from "framer-motion";
import HeroLogo from "./HeroLogo";
import MagneticButton from "./MagneticButton";

export default function Hero({
  title,
  subtitle,
  description,
  ctaPrimary,
  ctaSecondary,
}: {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}) {
  return (
    <section className="relative overflow-hidden">
      {/* atmospheric glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.14),transparent_60%)]" />
      </div>

      <div className="wrap grid items-center gap-8 py-20 md:grid-cols-2 md:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip text-neonpurple"
          >
            ★ {subtitle}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-[clamp(38px,6vw,68px)] font-black leading-[1.03] tracking-tight"
          >
            {title.split(" ").map((w, i) => (
              <span key={i} className={i === title.split(" ").length - 1 ? "grad-text" : ""}>
                {w}{" "}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-5 max-w-xl text-lg text-white/60"
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <MagneticButton href="/website-development" className="btn btn-primary">
              {ctaPrimary}
            </MagneticButton>
            <MagneticButton href="/contact" className="btn btn-ghost">
              {ctaSecondary}
            </MagneticButton>
          </motion.div>

          <div className="mt-11 flex flex-wrap gap-10">
            {[
              ["50+", "PROJECTS SHIPPED"],
              ["100%", "CLIENT FOCUSED"],
              ["24/7", "SUPPORT"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="grad-text text-3xl font-black">{n}</div>
                <div className="text-xs tracking-widest text-white/40">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Animated brand visual */}
        <div className="relative h-[340px] md:h-[520px]">
          <HeroLogo />
        </div>
      </div>
    </section>
  );
}
