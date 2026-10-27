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

/* ---------- ¿Abierto ahora? ----------
 * Lee el horario escrito en texto («Lunes a jueves» / «11:00 a. m. a 8:30 p. m.») y calcula el estado
 * en la hora de Costa Rica. Si no entiende alguna fila, la ignora; si no entiende ninguna, devuelve null. */
const SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] // lunes = 0
const NOMBRES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const sinTildes = (t) => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function diasDe(texto) {
  const t = sinTildes(texto)
  if (/todos los dias|a diario|diario/.test(t)) return [0, 1, 2, 3, 4, 5, 6]
  const hallados = [...t.matchAll(/lunes|martes|miercoles|jueves|viernes|sabado|domingo/g)].map((m) => SEMANA.indexOf(m[0]))
  if (!hallados.length) return []
  if (hallados.length === 2 && /\sa\s|\sal\s|-/.test(t)) {
    const [a, b] = hallados
    const dias = []
    for (let i = a; ; i = (i + 1) % 7) {
      dias.push(i)
      if (i === b || dias.length > 7) break
    }
    return dias
  }
  return [...new Set(hallados)]
}

function aMinutos(h, m, mer) {
  let hora = Number(h) % 12
  if (/^p/.test(mer)) hora += 12
  return hora * 60 + Number(m || 0)
}

export function horasDe(texto) {
  const t = sinTildes(texto).replace(/\./g, '').replace(/\s+/g, ' ').replace(/\b([ap]) m\b/g, '$1m')
  const r = t.match(/(\d{1,2})(?::(\d{2}))?\s?(am|pm)?\s?(?:a|-|hasta)\s?(\d{1,2})(?::(\d{2}))?\s?(am|pm)/)
  if (!r) return null
  const merCierre = r[6]
  const merApertura = r[3] || merCierre
  const abre = aMinutos(r[1], r[2], merApertura)
  let cierra = aMinutos(r[4], r[5], merCierre)
  if (cierra <= abre) cierra += 24 * 60
  return { abre, cierra }
}

export function formatoHora(min) {
  const m = ((min % 1440) + 1440) % 1440
  const h24 = Math.floor(m / 60)
  const mm = String(m % 60).padStart(2, '0')
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${mm} ${h24 < 12 ? 'a. m.' : 'p. m.'}`
}

function ahoraCR(fecha) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Costa_Rica', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha)
  const get = (t) => partes.find((p) => p.type === t)?.value
  const dia = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'))
  return { dia, min: Number(get('hour')) * 60 + Number(get('minute')) }
}

// Devuelve { abierto, texto, hoy } (hoy = índice de día 0-6 con lunes = 0) o null.
export function estadoAhora(horario, fecha = new Date()) {
  const filas = (horario || []).map((h) => ({ dias: diasDe(h.dias), horas: horasDe(h.horas) })).filter((f) => f.dias.length && f.horas)
  if (!filas.length) return null
  const { dia, min } = ahoraCR(fecha)
  const hoy = filas.find((f) => f.dias.includes(dia))
  if (hoy && min >= hoy.horas.abre && min < hoy.horas.cierra) {
    return { abierto: true, hoy: dia, texto: `Abierto ahora · cierra a las ${formatoHora(hoy.horas.cierra)}` }
  }
  if (hoy && min < hoy.horas.abre) {
    return { abierto: false, hoy: dia, texto: `Cerrado ahora · abre hoy a las ${formatoHora(hoy.horas.abre)}` }
  }
  for (let i = 1; i <= 7; i++) {
    const d = (dia + i) % 7
    const f = filas.find((x) => x.dias.includes(d))
    if (f) {
      const cuando = i === 1 ? 'mañana' : `el ${NOMBRES[d]}`
      return { abierto: false, hoy: dia, texto: `Cerrado ahora · abre ${cuando} a las ${formatoHora(f.horas.abre)}` }
    }
  }
  return null
}

export function diasDeFila(h) {
  return diasDe(h.dias)
}
