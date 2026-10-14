import galeria from './galeria.json'

// Busca fotos por su número (0 = portada, 1 = foto-01, …) en el orden pedido.
export const por = (...nums) =>
  nums
    .map((n) => galeria.find((f) => f.src === (n === 0 ? '/fotos/portada.webp' : `/fotos/foto-${String(n).padStart(2, '0')}.webp`)))
    .filter(Boolean)

// Agrupación de la galería (las 34 fotos, cada una en un solo grupo).
export const grupos = [
  { id: 'cortes', titulo: 'Cortes a la parrilla', fotos: por(0, 2, 6, 8, 15, 17, 19, 10) },
  { id: 'costillas', titulo: 'Costillas', fotos: por(1, 5, 7, 18) },
  { id: 'mar', titulo: 'Pescados y mariscos', fotos: por(3, 4, 9, 11, 12, 13, 23) },
  { id: 'mas', titulo: 'Más de nuestra cocina', fotos: por(16, 20, 21, 22, 24, 14) },
  { id: 'postres', titulo: 'Postres', fotos: por(25, 26, 27) },
  { id: 'bebidas', titulo: 'Bebidas y batidos', fotos: por(28, 29, 30, 31, 32, 33) },
]

// Selección variada para el inicio.
export const destacadas = por(2, 3, 26, 10, 28, 9, 15, 31, 7, 24)
