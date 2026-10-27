import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from './firebase'

/* ---------- Fechas (siempre en la hora local del navegador) ---------- */

export function hoyISO() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

// "2026-10-15" -> "jueves, 15 de octubre" (sin pasar por UTC para no correr el día)
export function formatoFecha(iso, opciones = { weekday: 'long', day: 'numeric', month: 'long' }) {
  if (!iso) return ''
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return String(iso)
  return new Date(y, m - 1, d).toLocaleDateString('es-CR', opciones)
}

// Una especialidad se muestra si tiene nombre y no ha vencido (campo "hasta" opcional).
export function esVigente(esp) {
  return Boolean(esp?.titulo?.trim()) && (!esp.hasta || esp.hasta >= hoyISO())
}

/* ---------- Firestore ---------- */

export { useConfig } from './config.jsx'

export function useColeccion(nombre, habilitado = true) {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(Boolean(db))
  useEffect(() => {
    if (!db || !habilitado) return
    return onSnapshot(
      collection(db, nombre),
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setCargando(false)
      },
      () => setCargando(false),
    )
  }, [nombre, habilitado])
  return { items, cargando }
}

// Eventos publicados de hoy en adelante, del más cercano al más lejano.
// El filtro por fecha se hace en la consulta, así los afiches viejos no se descargan.
export function useEventosProximos() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(Boolean(db))
  useEffect(() => {
    if (!db) return
    const q = query(collection(db, 'eventos'), where('fecha', '>=', hoyISO()))
    return onSnapshot(
      q,
      (snap) => {
        setItems(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((e) => e.publicado !== false)
            .sort((a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || ''))),
        )
        setCargando(false)
      },
      () => setCargando(false),
    )
  }, [])
  return { eventos: items, cargando }
}

export function usarMenu() {
  const cats = useColeccion('menuCategorias')
  const items = useColeccion('menuItems')
  const categorias = [...cats.items].sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
  const grupos = categorias
    .map((c) => ({
      ...c,
      platos: items.items
        .filter((i) => i.categoriaId === c.id && i.disponible !== false)
        .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    }))
    .filter((g) => g.platos.length > 0)
  return { grupos, categorias, items: items.items, cargando: cats.cargando || items.cargando }
}

export function formatoPrecio(p) {
  if (p === undefined || p === null || p === '') return ''
  const n = Number(p)
  if (Number.isNaN(n)) return String(p)
  return '₡' + n.toLocaleString('es-CR')
}
