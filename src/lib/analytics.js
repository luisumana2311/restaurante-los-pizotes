// Google Analytics 4. Solo carga si hay ID (VITE_GA_ID) y la persona aceptó las cookies.
const ID = import.meta.env.VITE_GA_ID
let cargado = false

export const hayAnalytics = Boolean(ID)

export function activarAnalytics() {
  if (!ID || cargado || typeof window === 'undefined') return
  cargado = true
  window['ga-disable-' + ID] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', ID, { send_page_view: false, anonymize_ip: true })
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`
  document.head.appendChild(s)
  vista(window.location.pathname + window.location.search)
}

export function desactivarAnalytics() {
  if (ID && typeof window !== 'undefined') window['ga-disable-' + ID] = true
}

export function vista(ruta) {
  if (!ID || !cargado || ruta.startsWith('/panel-admin')) return
  window.gtag('event', 'page_view', { page_path: ruta, page_location: window.location.origin + ruta })
}
