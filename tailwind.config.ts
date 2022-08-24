import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0a0a0f",
        panel: "#12121a",
        border: "#1e1e2e",
        accent: "#6366f1",
        "accent-hover": "#818cf8",
        "json-string": "#22d3ee",
        "json-number": "#f59e0b",
        "json-bool": "#a78bfa",
        "json-null": "#64748b",
        "json-key": "#e2e8f0",
      },
    },
  },
  plugins: [],
};
export default config;
