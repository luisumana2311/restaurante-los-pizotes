/** Paleta tomada del menú impreso 2025-2026 y del logo:
 *  marrón oscuro de fondo (#381914), crema (#feedd6) y naranja de los marcos (#ca752b). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brasa: '#381914',
        naranja: { DEFAULT: '#ca752b', oscuro: '#9a4f14' },
        crema: '#fcefd9',
        hueso: '#fff8ea',
      },
      fontFamily: {
        titulo: ['"Fraunces"', 'Georgia', 'serif'],
        texto: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
