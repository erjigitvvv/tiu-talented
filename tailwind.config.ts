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
        tiu: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fb",
          400: "#38a8f7",
          500: "#0e8de8",
          600: "#026fc6",
          700: "#0358a0",
          800: "#074b83",
          900: "#0b3f6e",
          950: "#072849",
        },
        accent: {
          gold: "#D4AF37",
          emerald: "#10B981",
        }
      },
    },
  },
  plugins: [],
};
export default config;
