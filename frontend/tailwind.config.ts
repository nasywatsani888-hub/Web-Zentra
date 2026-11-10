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
        zentra: {
          bg: "#080c14",
          surface: "#0e1420",
          card: "#131a29",
          cardHover: "#182236",
          border: "#1e293b",
          borderLight: "#334155",
          cyan: "#00E5FF",
          cyanDark: "#009bb3",
          primary: "#0284c7",
          danger: "#ef4444",
          warning: "#f59e0b",
          success: "#10b981",
          tableRow: "#0b192c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
