import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Professional charcoal + blue system (retuned from the old neon palette).
        ink: "#0B0D10", // deep charcoal background
        ink2: "#0F141A", // slightly raised
        panel: "#11151A", // surface
        line: "#252B33", // borders
        neonblue: "#3B82F6", // primary accent (professional blue)
        neonpurple: "#6366F1", // secondary accent (muted indigo)
        androidgreen: "#7be04f", // brand mark only
        muted: "#8B95A5",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 30px rgba(0,0,0,0.4)",
        glowblue: "0 8px 24px rgba(59,130,246,0.25)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
