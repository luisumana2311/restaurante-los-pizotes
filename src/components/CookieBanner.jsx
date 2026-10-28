import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { activarAnalytics, desactivarAnalytics, vista } from '../lib/analytics'

const CLAVE = 'pizotes-cookies'

export function leerConsentimiento() {
  try {
    return localStorage.getItem(CLAVE)
  } catch {
    return null
  }
}

function guardar(valor) {
  try {
    localStorage.setItem(CLAVE, valor)
  } catch {
    /* sin almacenamiento: el aviso volverá a aparecer en la próxima visita */
  }
}

// Aviso de cookies: se muestra hasta que la persona elija. Se puede volver a abrir desde el pie de página.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (leerConsentimiento() === 'todas') activarAnalytics()
    else if (!leerConsentimiento()) setVisible(true)
    const abrir = () => setVisible(true)
    window.addEventListener('abrir-cookies', abrir)
    return () => window.removeEventListener('abrir-cookies', abrir)
  }, [])

  // Cada cambio de página cuenta como una visita (solo si aceptó).
  useEffect(() => {
    if (leerConsentimiento() === 'todas') vista(pathname + search)
  }, [pathname, search])

  if (!visible) return null

  const elegir = (valor) => {
    guardar(valor)
    if (valor === 'todas') activarAnalytics()
    else desactivarAnalytics()
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-naranja/40 bg-brasa p-4 text-hueso shadow-2xl sm:p-5"
    >
      <p className="text-sm leading-relaxed">
        Usamos almacenamiento técnico para que el sitio funcione. Si aceptás, también usamos Google Analytics para saber
        cuántas personas nos visitan y qué páginas ven (datos anónimos). No usamos cookies de publicidad. Más información en nuestra{' '}
        <Link to="/cookies" className="underline">
          política de cookies
        </Link>{' '}
        y{' '}
        <Link to="/privacidad" className="underline">
          política de privacidad
        </Link>
        .
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end">
        <button type="button" onClick={() => elegir('necesarias')} className="rounded-full border border-hueso/40 px-5 py-2 text-sm font-semibold hover:bg-hueso hover:text-brasa">
          Solo necesarias
        </button>
        <button type="button" onClick={() => elegir('todas')} className="rounded-full bg-naranja-oscuro px-5 py-2 text-sm font-semibold text-hueso hover:bg-naranja">
          Aceptar
        </button>
      </div>
    </div>
  )
}
