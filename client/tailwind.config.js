/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#090909',
          surface: '#141414',
          card: '#191919',
          cardHover: '#222222',
          gold: '#D7AD55',
          goldLight: '#F2D28A',
          goldDark: '#B88F3A',
          text: '#F5F2EA',
          muted: '#A5A19A',
          border: '#292722',
          borderHover: '#3D3933',
          red: '#EF4444',
          green: '#10B981',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cinzel', 'Plus Jakarta Sans', 'serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(215, 173, 85, 0.15)',
        'gold-md': '0 4px 20px rgba(215, 173, 85, 0.25)',
        'gold-glow': '0 0 30px rgba(215, 173, 85, 0.35)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
}
