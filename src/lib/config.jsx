import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

// Módulos que el dueño puede encender o apagar desde el panel. Inicio y Contacto siempre están.
export const MODULOS = [
  { clave: 'menu', nombre: 'Menú', descripcion: 'Página del menú, su enlace en la barra de navegación y los botones «Ver el menú».' },
  { clave: 'especialidad', nombre: 'Especialidad del día', descripcion: 'Tarjeta de la especialidad en el inicio y arriba del menú. Lo que ya escribiste se conserva.' },
  { clave: 'eventos', nombre: 'Eventos', descripcion: 'Página de eventos, su enlace y los próximos eventos en el inicio. Los eventos se conservan.' },
  { clave: 'galeria', nombre: 'Galería de fotos', descripcion: 'Página de galería, su enlace y el carrusel de fotos del inicio.' },
]

export const ConfigContext = createContext(null)

// Una sola suscripción a config/sitio para todo el sitio.
export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({})
  const [cargando, setCargando] = useState(Boolean(db))

  useEffect(() => {
    if (!db) return
    return onSnapshot(
      doc(db, 'config', 'sitio'),
      (snap) => {
        setConfig(snap.exists() ? snap.data() : {})
        setCargando(false)
      },
      () => setCargando(false),
    )
  }, [])

  const valor = useMemo(
    () => ({
      config,
      cargando,
      // Por defecto todo está encendido; solo se apaga si el dueño lo desactivó.
      activo: (clave) => config.modulos?.[clave] !== false,
    }),
    [config, cargando],
  )
  return <ConfigContext.Provider value={valor}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const v = useContext(ConfigContext)
  if (!v) throw new Error('useConfig debe usarse dentro de <ConfigProvider>')
  return v
}
