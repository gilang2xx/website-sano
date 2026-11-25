// CSS hasil build untuk 4 halaman landing (menggantikan Tailwind CDN di HTML prerender landing).
// Tema = salinan persis dari <script>tailwind.config</script> di index.html (yang tetap dipakai halaman lain).
module.exports = {
  darkMode: 'class',
  content: ['./pages/landing/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './utils/**/*.ts', './constants.ts', './types.ts'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#2064B7', light: '#C6DBF2', dark: '#164A88' },
        secondary: { DEFAULT: '#6ECDC5', light: '#C9F1ED', dark: '#357872' },
        bg: { light: '#F7F9FB', dark: '#0F141A', surface: '#1A232C' },
        text: { dark: '#E7ECF2', muted: '#9BA5B4' },
      },
    },
  },
};
