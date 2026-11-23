import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#18202b",
        ink: "#0f151d",
        chalk: "#f5f6f3",
        surface: "#ffffff",
        signal: "#f2b705",
        "signal-deep": "#e0a900",
        sign: "#0b4ea2",
        line: "#d9dcd6",
        mute: "#4a5461",
        ok: "#17633d",
        danger: "#b42318",
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        cond: ['"IBM Plex Sans Condensed"', '"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(24,32,43,0.06), 0 8px 24px -12px rgba(24,32,43,0.18)",
        lift: "0 2px 4px rgba(24,32,43,0.08), 0 18px 40px -16px rgba(24,32,43,0.28)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
