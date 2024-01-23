import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary_dark: '#212529',
        primary_light: '#E9ECEF',
        secondary_dark: '#343A40',
        secondary_light: '#DEE2E6',
        tertiary_dark: '#495057',
        tertiary_light: '#CED4DA',
      }
    },
  },
  plugins: [],
};
export default config;
