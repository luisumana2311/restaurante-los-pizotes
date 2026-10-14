/** Paleta provisional tomada del logo (pizote en negro con naranja).
 *  Ajustar cuando se confirmen los colores de marca reales. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brasa: '#1b1613',
        naranja: { DEFAULT: '#e2692a', oscuro: '#b94f18' },
        crema: '#f7f0e4',
        hueso: '#fffaf1',
      },
      fontFamily: {
        titulo: ['"Fraunces"', 'Georgia', 'serif'],
        texto: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
