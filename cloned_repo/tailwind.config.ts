import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        border: "var(--border)",
        border2: "var(--border2)",
        text: "var(--text)",
        muted: "var(--muted)",
        muted2: "var(--muted2)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        accent3: "var(--accent3)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "sans-serif"],
        mono: ["var(--font-dm-mono)", "DM Mono", "monospace"],
        serif: ["var(--font-instrument-serif)", "Instrument Serif", "serif"],
      },
      animation: {
        blink: "blink 2.2s infinite",
        "glitch-line": "glitch-line 4s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
