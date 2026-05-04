import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      colors: {
        surface: "#ffffff",
        surfaceMuted: "#f8fafc",
        borderSubtle: "#e2e8f0",
        ink: "#0f172a",
        inkMuted: "#475569",
        brand: {
          DEFAULT: "#1d4ed8",
          foreground: "#ffffff"
        },
        optionA: {
          DEFAULT: "#1d4ed8",
          soft: "#eff6ff",
          muted: "#60a5fa"
        },
        optionB: {
          DEFAULT: "#0369a1",
          soft: "#f0f9ff",
          muted: "#38bdf8"
        }
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)",
        panelLg:
          "0 1px 2px 0 rgb(15 23 42 / 0.05), 0 8px 24px -8px rgb(15 23 42 / 0.12)"
      },
      borderRadius: {
        panel: "0.75rem",
        "panel-lg": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
