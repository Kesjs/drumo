import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#18202b",
        chalk: "#f5f6f3",
        surface: "#ffffff",
        signal: "#f2b705",
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
    },
  },
  plugins: [animate],
} satisfies Config;
