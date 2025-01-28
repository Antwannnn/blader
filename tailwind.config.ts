import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      darkMode: 'class',
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: 'var(--background)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        text: 'var(--text)',
        accent: 'var(--accent)',
        accent_hover: 'var(--accent-hover)',
        accent_disabled: 'var(--accent-disabled)',
        accent_disabled_hover: 'var(--accent-disabled-hover)',
      },
      opacity: {
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1'
      }
    },
  },
  plugins: [],
};
export default config;
