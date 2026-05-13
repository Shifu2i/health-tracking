import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0f14",
        panel: "#121823",
        border: "#1f2937",
        text: "#e5e7eb",
        muted: "#9ca3af",
        accent: "#60a5fa",
        ok: "#34d399",
        warn: "#fbbf24",
        bad: "#f87171",
      },
    },
  },
  plugins: [],
};

export default config;
