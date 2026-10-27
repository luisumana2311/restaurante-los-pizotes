import { useMemo, useState } from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useColeccion } from '../../lib/data'

const TIPOS = { sugerencia: 'Sugerencia', queja: 'Queja', felicitacion: 'Felicitación' }
const COLOR = { sugerencia: 'bg-crema', queja: 'bg-red-100 text-red-900', felicitacion: 'bg-green-100 text-green-900' }

function cuando(f) {
  const d = f?.toDate?.()
  return d ? d.toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' }) : 'Enviando…'
}

export default function EditorOpiniones() {
  const { items, cargando } = useColeccion('opiniones')
  const [filtro, setFiltro] = useState('todas')

  const lista = useMemo(
    () =>
      [...items]
        .sort((a, b) => (b.fecha?.toMillis?.() ?? Date.now()) - (a.fecha?.toMillis?.() ?? Date.now()))
        .filter((o) => filtro === 'todas' || (filtro === 'nuevas' ? !o.leida : o.tipo === filtro)),
    [items, filtro],
  )
  const nuevas = items.filter((o) => !o.leida).length

  const marcar = (o) => updateDoc(doc(db, 'opiniones', o.id), { leida: !o.leida })
  const borrar = (o) => window.confirm('¿Borrar esta opinión para siempre?') && deleteDoc(doc(db, 'opiniones', o.id))

  return (
    <div className="space-y-4">
      <p className="text-sm text-brasa/70">Mensajes enviados desde el formulario privado del sitio. Nadie más puede verlos.</p>
      <div className="flex flex-wrap gap-2 text-sm">
        {[
          ['todas', `Todas (${items.length})`],
          ['nuevas', `Sin leer (${nuevas})`],
          ['queja', 'Quejas'],
          ['sugerencia', 'Sugerencias'],
          ['felicitacion', 'Felicitaciones'],
        ].map(([id, t]) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`rounded-full border px-3 py-1 ${filtro === id ? 'border-brasa bg-brasa text-hueso' : 'border-brasa/25 bg-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {cargando && <p>Cargando…</p>}
      {!cargando && lista.length === 0 && <p className="rounded-2xl bg-white p-5 shadow-sm">No hay opiniones en esta vista.</p>}

      <ul className="space-y-3">
        {lista.map((o) => (
          <li key={o.id} className={`rounded-2xl bg-white p-4 shadow-sm ${o.leida ? 'opacity-70' : 'ring-2 ring-naranja'}`}>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className={`rounded-full px-2.5 py-0.5 font-semibold ${COLOR[o.tipo] || 'bg-crema'}`}>{TIPOS[o.tipo] || o.tipo}</span>
              {!o.leida && <span className="rounded-full bg-naranja-oscuro px-2.5 py-0.5 font-semibold text-white">Nueva</span>}
              <span className="text-brasa/60">{cuando(o.fecha)}</span>
            </div>
            <p className="mt-3 whitespace-pre-wrap">{o.mensaje}</p>
            <p className="mt-3 text-sm text-brasa/70">
              {o.nombre || 'Anónimo'}
              {o.contacto && (
                <>
                  {' · '}
                  <a className="underline" href={o.contacto.includes('@') ? `mailto:${o.contacto}` : `tel:${o.contacto.replace(/[^\d+]/g, '')}`}>
                    {o.contacto}
                  </a>
                </>
              )}
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <button className="underline" onClick={() => marcar(o)}>
                {o.leida ? 'Marcar como sin leer' : 'Marcar como leída'}
              </button>
              <button className="text-red-700 underline" onClick={() => borrar(o)}>
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
