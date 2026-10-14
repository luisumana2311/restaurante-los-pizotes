import { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { MODULOS, useConfig } from '../../lib/config'

export default function EditorModulos() {
  const { activo } = useConfig()
  const [ocupado, setOcupado] = useState('')
  const [msg, setMsg] = useState('')

  async function cambiar(m) {
    const nuevo = !activo(m.clave)
    setOcupado(m.clave)
    setMsg('')
    try {
      await setDoc(doc(db, 'config', 'sitio'), { modulos: { [m.clave]: nuevo } }, { merge: true })
      setMsg(`${m.nombre}: ${nuevo ? 'activado' : 'desactivado'}. El cambio ya se ve en el sitio.`)
    } catch {
      setMsg('No se pudo cambiar. Revisá tu conexión y que tu cuenta tenga permiso.')
    } finally {
      setOcupado('')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-brasa/70">
        Apagá una sección para ocultarla de todo el sitio sin borrar su contenido. Cuando la volvés a activar, todo vuelve como estaba.
      </p>
      <ul className="divide-y divide-brasa/10 rounded-2xl bg-white px-4 shadow-sm">
        {MODULOS.map((m) => {
          const encendido = activo(m.clave)
          return (
            <li key={m.clave} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold">{m.nombre}</p>
                <p className="text-sm text-brasa/70">{m.descripcion}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={encendido}
                aria-label={`${m.nombre}: ${encendido ? 'activado' : 'desactivado'}`}
                disabled={ocupado === m.clave}
                onClick={() => cambiar(m)}
                className="flex flex-none items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja focus-visible:ring-offset-2 disabled:opacity-60"
              >
                <span className={`relative h-7 w-12 rounded-full transition ${encendido ? 'bg-naranja' : 'bg-brasa/25'}`}>
                  <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${encendido ? 'left-[1.375rem]' : 'left-0.5'}`} />
                </span>
                <span className="w-24 text-left text-sm font-medium">{encendido ? 'Activado' : 'Desactivado'}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {msg && (
        <p className="text-sm" role="status">
          {msg}
        </p>
      )}
    </div>
  )
}
