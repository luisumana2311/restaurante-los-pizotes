// Datos reales tomados de la página de Facebook del restaurante.
// El horario y el WhatsApp NO van aquí: los edita el dueño desde el panel admin.
export const INFO = {
  nombre: 'Restaurante Los Pizotes',
  telefono: '2534 6097',
  telefonoLink: '+50625346097',
  correo: 'restaurantepizotes@gmail.com',
  direccion: 'San Isidro de Cervantes, Alvarado, Cartago, Costa Rica',
  facebook: 'https://www.facebook.com/Lospizotesrestaurante',
  instagram: 'https://www.instagram.com/restaurante_pizotes/',
  mapa: 'https://maps.app.goo.gl/hG39QBP7Uoir4Gjm8',
}

export function linkWhatsApp(numero, texto = 'Hola, quisiera consultar sobre Restaurante Los Pizotes.') {
  const limpio = String(numero || '').replace(/\D/g, '')
  if (!limpio) return null
  return `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`
}
