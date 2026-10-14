import { useState } from 'react'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { formatoFecha, hoyISO, useColeccion } from '../../lib/data'
import CampoFoto from '../../components/CampoFoto'

const VACIO = { titulo: '', fecha: '', hora: '', descripcion: '', foto: '', publicado: true }

export default function EditorEventos() {
  const { items, cargando } = useColeccion('eventos')
  const [editando, setEditando] = useState(null)
  const [msg, setMsg] = useState('')
  const hoy = hoyISO()

  const proximos = items.filter((e) => e.fecha >= hoy).sort((a, b) => a.fecha.localeCompare(b.fecha))
  const pasados = items.filter((e) => !(e.fecha >= hoy)).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

  async function guardar(e) {
    e.preventDefault()
    const { id, ...d } = editando
    if (!d.titulo.trim() || !d.fecha) {
      setMsg('El evento necesita nombre y fecha.')
      return
    }
    const datos = {
      titulo: d.titulo.trim(),
      fecha: d.fecha,
      hora: (d.hora || '').trim(),
      descripcion: (d.descripcion || '').trim(),
      foto: d.foto || '',
      publicado: d.publicado !== false,
    }
    try {
      if (id) await updateDoc(doc(db, 'eventos', id), datos)
      else await addDoc(collection(db, 'eventos'), datos)
      setEditando(null)
      setMsg('Guardado.')
    } catch {
      setMsg('No se pudo guardar. Revisá tu conexión y que tu cuenta tenga permiso.')
    }
  }
  const alternar = (ev) => updateDoc(doc(db, 'eventos', ev.id), { publicado: ev.publicado === false })
  async function borrar(ev) {
    if (window.confirm(`¿Borrar el evento "${ev.titulo}"?`)) await deleteDoc(doc(db, 'eventos', ev.id))
  }

  const fila = (ev) => (
    <li key={ev.id} className="flex items-center gap-3 py-3">
      {ev.foto && <img src={ev.foto} alt="" className="h-14 w-14 flex-none rounded-lg object-cover" />}
      <div className={`min-w-0 flex-1 ${ev.publicado === false ? 'opacity-50' : ''}`}>
        <p className="truncate font-medium">{ev.titulo}</p>
        <p className="text-sm text-brasa/70">
          {formatoFecha(ev.fecha, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          {ev.hora ? ` · ${ev.hora}` : ''}
          {ev.publicado === false ? ' · Oculto' : ''}
        </p>
      </div>
      <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-sm">
        <button className="underline" onClick={() => setEditando(ev)}>Editar</button>
        <button className="underline" onClick={() => setEditando({ ...ev, id: undefined, fecha: '' })}>Duplicar</button>
        <button className="underline" onClick={() => alternar(ev)}>{ev.publicado === false ? 'Mostrar' : 'Ocultar'}</button>
        <button className="text-red-700 underline" onClick={() => borrar(ev)}>Borrar</button>
      </div>
    </li>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-brasa/70">
          Los eventos aparecen en <strong>/eventos</strong> y en el inicio. Cuando pasa la fecha se ocultan solos del sitio.
        </p>
        <button className="boton whitespace-nowrap" onClick={() => setEditando(VACIO)}>
          + Nuevo evento
        </button>
      </div>
      {msg && <p className="text-sm" role="status">{msg}</p>}
      {cargando && <p>Cargando…</p>}

      <section>
        <h3 className="text-lg font-bold">Próximos</h3>
        {proximos.length === 0 ? (
          <p className="mt-2 text-sm text-brasa/60">No hay eventos próximos. Creá uno con «+ Nuevo evento».</p>
        ) : (
          <ul className="mt-2 divide-y divide-brasa/10 rounded-2xl bg-white px-4 shadow-sm">{proximos.map(fila)}</ul>
        )}
      </section>

      {pasados.length > 0 && (
        <section>
          <h3 className="text-lg font-bold">Pasados</h3>
          <ul className="mt-2 divide-y divide-brasa/10 rounded-2xl bg-white px-4 shadow-sm">{pasados.map(fila)}</ul>
        </section>
      )}

      {editando && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={guardar} className="max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold">{editando.id ? 'Editar evento' : 'Nuevo evento'}</h3>
            <label className="block text-sm font-medium">
              Nombre del evento
              <input className="campo mt-1" required value={editando.titulo} onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Fecha
              <input className="campo mt-1" type="date" required value={editando.fecha} onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Hora (texto libre, ej. 12:30 p. m. a 6:00 p. m.)
              <input className="campo mt-1" value={editando.hora} onChange={(e) => setEditando({ ...editando, hora: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Descripción (opcional)
              <textarea className="campo mt-1" rows="3" value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </label>
            <CampoFoto etiqueta="Afiche o foto del evento" valor={editando.foto} onCambio={(f) => setEditando({ ...editando, foto: f })} />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={editando.publicado !== false} onChange={(e) => setEditando({ ...editando, publicado: e.target.checked })} />
              Mostrar en el sitio
            </label>
            <div className="flex justify-end gap-3">
              <button type="button" className="boton-claro" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="boton">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
