/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slick-red': '#F20D16',
        'slick-dark': '#080713',
        'slick-cream': '#F1EBDD',
        'slick-cream-light': '#F7F3EB',
        'slick-cream-dark': '#E5DFC-D',
        'slick-muted': '#A69F99',
        'slick-border': 'rgba(255, 255, 255, 0.12)',
        'slick-border-dark': 'rgba(8, 7, 19, 0.12)',
      },
      fontFamily: {
        grotesk: ['Syne', 'Cabinet Grotesk', 'Inter', 'sans-serif'],
        serif: ['Instrument Serif', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
