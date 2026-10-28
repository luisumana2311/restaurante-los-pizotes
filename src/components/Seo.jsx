import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BASE = 'https://restaurantelospizotes.com'
const NOMBRE = 'Restaurante Los Pizotes'

// Título y descripción propios de cada página, para buscadores y para cuando se comparte el enlace.
const PAGINAS = {
  '/': { t: `${NOMBRE} | Cervantes, Cartago`, d: 'Restaurante Los Pizotes en San Isidro de Cervantes, Cartago: platos típicos, cortes, mariscos, café y cócteles.' },
  '/menu': { t: `Menú | ${NOMBRE}`, d: 'Mirá el menú completo de Los Pizotes: para picar, platos fuertes, cortes Certified Angus Beef, mariscos, postres, café y bar.' },
  '/contacto': { t: `Contacto y cómo llegar | ${NOMBRE}`, d: 'Horario, teléfono, WhatsApp y ubicación de Los Pizotes en San Isidro de Cervantes, Alvarado, Cartago.' },
  '/galeria': { t: `Galería | ${NOMBRE}`, d: 'Fotos de los platos y del ambiente de Restaurante Los Pizotes, en Cervantes de Cartago.' },
  '/eventos': { t: `Eventos | ${NOMBRE}`, d: 'Próximos eventos y actividades en Restaurante Los Pizotes, Cervantes de Cartago.' },
  '/privacidad': { t: `Política de privacidad | ${NOMBRE}`, d: 'Cómo tratamos tus datos personales en el sitio de Restaurante Los Pizotes.' },
  '/cookies': { t: `Política de cookies | ${NOMBRE}`, d: 'Qué cookies usa el sitio de Restaurante Los Pizotes y cómo cambiar tus preferencias.' },
  '/opinion': { t: `Tu opinión | ${NOMBRE}`, d: 'Contanos tu opinión, sugerencia o queja de forma privada.', noindex: true },
}

function poner(selector, crear, atributo, valor) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = crear()
    document.head.appendChild(el)
  }
  el.setAttribute(atributo, valor)
}

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const ruta = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
    const pag = PAGINAS[ruta]
    const info = pag || { t: `${NOMBRE} | Cervantes, Cartago`, d: PAGINAS['/'].d, noindex: true }
    document.title = info.t
    const meta = (nombre, valor, attr = 'name') =>
      poner(`meta[${attr}="${nombre}"]`, () => Object.assign(document.createElement('meta'), { [attr]: nombre }), 'content', valor)
    meta('description', info.d)
    meta('og:title', info.t, 'property')
    meta('og:description', info.d, 'property')
    meta('og:url', BASE + (pag ? ruta : '/'), 'property')
    meta('robots', info.noindex || ruta.startsWith('/panel-admin') ? 'noindex, nofollow' : 'index, follow')
    poner('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', BASE + (pag ? ruta : '/'))
  }, [pathname])
  return null
}
