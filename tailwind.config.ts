import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    "#09111f",
          navy:    "#0f172a",
          surface: "#111827",
          card:    "#141e2f",
          border:  "#1e2d45",
          gold:    "#c8a34d",
          "gold-light": "#dfc278",
          "gold-dim":   "#8a6e2f",
          slate:   "#94a3b8",
          muted:   "#64748b",
          light:   "#f1f5f9",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.7s ease forwards",
        "fade-in":    "fadeIn 0.6s ease forwards",
        "pulse-ring": "pulseRing 2s ease-out infinite",
        "counter":    "counter 2s ease-out forwards",
        "shimmer":    "shimmer 2.5s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseRing: {
          "0%":   { transform: "scale(1)", opacity: "0.8" },
          "70%":  { transform: "scale(1.5)", opacity: "0" },
          "100%": { opacity: "0" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #c8a34d 0%, #dfc278 50%, #c8a34d 100%)",
        "dark-gradient": "linear-gradient(180deg, #09111f 0%, #0f172a 100%)",
        "mesh":          "radial-gradient(at 40% 20%, hsla(220,70%,8%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(35,60%,25%,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,70%,5%,1) 0px, transparent 50%)",
      },
      boxShadow: {
        "gold":      "0 0 0 1px rgba(200,163,77,0.3), 0 4px 20px rgba(200,163,77,0.1)",
        "gold-lg":   "0 0 0 1px rgba(200,163,77,0.4), 0 8px 40px rgba(200,163,77,0.15)",
        "card":      "0 1px 3px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)",
        "card-hover":"0 2px 8px rgba(0,0,0,0.6), 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(200,163,77,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
