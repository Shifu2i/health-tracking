import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f6f4ef",
        surface: "#ffffff",
        ink: "#0f0f0f",
        ink2: "#3a3a3a",
        muted: "#7a7570",
        rule: "#e5e0d6",
        rule2: "#d3cdbf",
        hover: "#efebe2",
        // Back-compat aliases so existing class names render monochrome.
        panel: "#ffffff",
        border: "#e5e0d6",
        text: "#0f0f0f",
        accent: "#0f0f0f",
        ok: "#0f0f0f",
        warn: "#3a3a3a",
        bad: "#0f0f0f",
      },
      fontFamily: {
        serif: ['"Source Serif 4"', '"Iowan Old Style"', "Georgia", "ui-serif", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.16em",
      },
    },
  },
  plugins: [],
};

export default config;
