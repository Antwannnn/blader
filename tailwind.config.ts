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
        background: 'rgb(var(--background) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        tertiary: 'rgb(var(--tertiary) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        text_secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
        text_error: 'rgb(var(--text-error) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        accent_hover: 'rgb(var(--accent-hover) / <alpha-value>)',
        accent_disabled: 'rgb(var(--accent-disabled) / <alpha-value>)',
        accent_disabled_hover: 'rgb(var(--accent-disabled-hover) / <alpha-value>)',
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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
