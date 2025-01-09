/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
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
