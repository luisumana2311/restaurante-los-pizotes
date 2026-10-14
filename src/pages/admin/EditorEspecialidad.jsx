import { useEffect, useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { esVigente, formatoFecha, useConfig } from '../../lib/data'
import CampoFoto from '../../components/CampoFoto'

const ETIQUETAS = ['Especialidad del día', 'Especialidad del fin de semana', 'Especialidad de la semana']
const VACIA = { etiqueta: ETIQUETAS[0], titulo: '', descripcion: '', precio: '', foto: '', hasta: '' }

export default function EditorEspecialidad() {
  const { config } = useConfig()
  const [esp, setEsp] = useState(VACIA)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setEsp({ ...VACIA, ...(config.especialidad || {}) })
  }, [config])

  const guardada = config.especialidad
  const estado = !guardada?.titulo
    ? 'No hay ninguna especialidad publicada: la sección no aparece en el sitio.'
    : esVigente(guardada)
      ? `Se está mostrando en el sitio${guardada.hasta ? ` hasta el ${formatoFecha(guardada.hasta)}` : ''}.`
      : 'Está vencida: ya no se muestra en el sitio.'

  async function publicar(e) {
    e.preventDefault()
    if (!esp.titulo.trim()) {
      setMsg('Escribí el nombre del plato.')
      return
    }
    try {
      await setDoc(
        doc(db, 'config', 'sitio'),
        {
          especialidad: {
            etiqueta: esp.etiqueta,
            titulo: esp.titulo.trim(),
            descripcion: (esp.descripcion || '').trim(),
            precio: esp.precio === '' || esp.precio === undefined ? '' : Number(esp.precio),
            foto: esp.foto || '',
            hasta: esp.hasta || '',
          },
        },
        { merge: true },
      )
      setMsg('Publicado. Ya se ve en el sitio.')
    } catch {
      setMsg('No se pudo guardar. Revisá tu conexión y que tu cuenta tenga permiso.')
    }
  }

  async function quitar() {
    try {
      await setDoc(doc(db, 'config', 'sitio'), { especialidad: null }, { merge: true })
      setMsg('Especialidad quitada del sitio.')
    } catch {
      setMsg('No se pudo quitar.')
    }
  }

  return (
    <form onSubmit={publicar} className="space-y-4">
      <p className="rounded-lg bg-crema p-3 text-sm" role="status">
        {estado}
      </p>
      <p className="text-sm text-brasa/70">
        Aparece en el inicio y arriba del menú. Con «Disponible hasta» se oculta sola después de esa fecha.
      </p>

      <label className="block text-sm font-medium">
        Tipo
        <select className="campo mt-1" value={esp.etiqueta} onChange={(e) => setEsp({ ...esp, etiqueta: e.target.value })}>
          {ETIQUETAS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium">
        Nombre del plato
        <input className="campo mt-1" value={esp.titulo} onChange={(e) => setEsp({ ...esp, titulo: e.target.value })} />
      </label>
      <label className="block text-sm font-medium">
        Descripción
        <textarea className="campo mt-1" rows="3" value={esp.descripcion} onChange={(e) => setEsp({ ...esp, descripcion: e.target.value })} />
      </label>
      <label className="block text-sm font-medium">
        Precio en colones (solo número, opcional)
        <input className="campo mt-1" type="number" min="0" step="1" value={esp.precio} onChange={(e) => setEsp({ ...esp, precio: e.target.value })} />
      </label>
      <label className="block text-sm font-medium">
        Disponible hasta (opcional)
        <input className="campo mt-1" type="date" value={esp.hasta} onChange={(e) => setEsp({ ...esp, hasta: e.target.value })} />
      </label>
      <CampoFoto valor={esp.foto} onCambio={(f) => setEsp({ ...esp, foto: f })} />

      <div className="flex flex-wrap gap-3">
        <button className="boton">Publicar</button>
        <button type="button" className="boton-claro" onClick={quitar}>
          Quitar del sitio
        </button>
      </div>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  )
}
