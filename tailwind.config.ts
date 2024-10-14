import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in',
      },
      screens: {
        'sm': { 'min': '0px', 'max': '850px' },
        'big': { 'min': '851px', 'max': '10000000px' }
        // => @media (min-width: 640px and max-width: 767px) { ... }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },

  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#436be1', // primary color
          secondary: '#ffffff', // secondary color
          accent: '#8bc34a', // accent color
          neutral: '#37474f', // neutral color
          'base-100': '#04040d', // base 100 background color
          color: "#ffffff", // text color
          info: '#00bcd4',
          success: '#4caf50',
          warning: '#ffc107',
          error: '#f44336',
          li: {
            color: '#436be1'
          },
          '.btn-primary': {
            color: '#ffffff',
          },
          '.carousal-bg': {
            background: 'linear-gradient(270deg, rgba(4,4,13,1) 0%, rgba(4,4,13,0) 100%);',
          },
          '.carousal-bg-pt': {
            background: 'linear-gradient(0deg, rgba(4,4,13,1) 0%, rgba(4,4,13,0) 100%);',
          },
        },
        light: {
          primary: '#a4bbff', // primary color
          secondary: '#000000', // secondary color
          accent: '#8bc34a', // accent color
          neutral: '#37474f', // neutral color
          'base-100': '#ffffff', // base 100 background color
          color: "#000000", // text color
          info: '#00bcd4',
          success: '#4caf50',
          warning: '#ffc107',
          error: '#f44336',
          li: {
            color: '#436be1'
          },
          '.btn-primary': {
            color: '#000000',
          },
          '.carousal-bg': {
            background: 'linear-gradient(270deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);',
          },
          '.carousal-bg-pt': {
            background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%);',
          },
        },
      },
    ],
  },
};
export default config;
