import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#05060f",
          900: "#0a0b1a",
          800: "#111327",
          700: "#1a1d38",
        },
        accent: {
          cyan: "#4ecdc4",
          violet: "#8b5cf6",
          amber: "#fbbf24",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(78, 205, 196, 0.25)",
        "glow-violet": "0 0 40px rgba(139, 92, 246, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
