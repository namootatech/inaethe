/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  siteConfig: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  theme: {
    extend: {
      animation: {
        'pulse-shadow': 'pulse-shadow 3s infinite',
      },
      keyframes: {
        'pulse-shadow': {
          '0%, 100%': {
            boxShadow: '0 0 20px 4px rgba(236, 72, 153, 0.3)',
            scale: 1,
            transform: 'scale(.9) translateY(3%)',
          },
          '50%': {
            boxShadow: '0 0 30px 10px rgba(236, 72, 153, 0.5)',
            transform: 'scale(1) translateY(-3%)',
          },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    { pattern: /bg-./, variants: ['hover'] },
    { pattern: /bg-\[url\(.*?\)\]/, variants: ['hover'] },
    { pattern: /text-./, variants: ['hover'] },
    { pattern: /border-./, variants: ['hover'] },
    { pattern: /from-./, variants: ['hover'] },
    { pattern: /to-./, variants: ['hover'] },
    { pattern: /bg-gradient-./, variants: ['hover'] },
  ],
};
