// Datos reales tomados de la página de Facebook del restaurante.
// El WhatsApp lo edita el dueño desde el panel admin. El horario de abajo es el predeterminado:
// si el dueño guarda otro desde el panel, ese tiene prioridad.
export const INFO = {
  nombre: 'Restaurante Los Pizotes',
  telefono: '2534 6097',
  telefonoLink: '+50625346097',
  correo: 'restaurantepizotes@gmail.com',
  direccion: 'San Isidro de Cervantes, Alvarado, Cartago, Costa Rica',
  facebook: 'https://www.facebook.com/Lospizotesrestaurante',
  instagram: 'https://www.instagram.com/restaurante_pizotes/',
  mapa: 'https://maps.app.goo.gl/hG39QBP7Uoir4Gjm8',
  horario: [
    { dias: 'Lunes a jueves', horas: '11:00 a. m. a 8:30 p. m.' },
    { dias: 'Viernes y sábado', horas: '11:00 a. m. a 10:00 p. m.' },
    { dias: 'Domingo', horas: '11:00 a. m. a 7:30 p. m.' },
  ],
}

// Horario guardado por el dueño en el panel; si no hay, el predeterminado.
export function horarioDe(config) {
  const propio = Array.isArray(config?.horario) ? config.horario.filter((h) => h.dias && h.horas) : []
  return propio.length ? propio : INFO.horario
}

export function linkWhatsApp(numero, texto = 'Hola, quisiera consultar sobre Restaurante Los Pizotes.') {
  const limpio = String(numero || '').replace(/\D/g, '')
  if (!limpio) return null
  return `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`
}
