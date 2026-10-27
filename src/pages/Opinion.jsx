import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { INFO } from '../lib/info'

const TIPOS = [
  { id: 'sugerencia', t: 'Sugerencia', d: 'Una idea para mejorar' },
  { id: 'queja', t: 'Queja', d: 'Algo que salió mal' },
  { id: 'felicitacion', t: 'Felicitación', d: 'Algo que te gustó' },
]
const MAX = 1500

// Formulario privado: se guarda en Firestore y solo lo puede leer la administración (ver firestore.rules).
export default function Opinion() {
  const [tipo, setTipo] = useState('sugerencia')
  const [mensaje, setMensaje] = useState('')
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [trampa, setTrampa] = useState('') // campo oculto: los bots lo llenan, las personas no
  const [estado, setEstado] = useState('listo') // listo | enviando | enviado | error
  const [aviso, setAviso] = useState('')

  async function enviar(e) {
    e.preventDefault()
    setAviso('')
    if (mensaje.trim().length < 5) return setAviso('Contanos un poco más, por favor.')
    if (trampa) return setEstado('enviado') // bot: fingimos éxito sin guardar nada
    try {
      const ultimo = Number(localStorage.getItem('opinionEnviada') || 0)
      if (Date.now() - ultimo < 60000) return setAviso('Acabás de enviar una opinión. Esperá un minuto para enviar otra.')
    } catch {
      /* sin localStorage: se sigue igual */
    }
    if (!db) return setEstado('error')
    setEstado('enviando')
    try {
      await addDoc(collection(db, 'opiniones'), {
        tipo,
        mensaje: mensaje.trim().slice(0, MAX),
        nombre: nombre.trim().slice(0, 80),
        contacto: contacto.trim().slice(0, 120),
        leida: false,
        fecha: serverTimestamp(),
      })
      try {
        localStorage.setItem('opinionEnviada', String(Date.now()))
      } catch {
        /* nada */
      }
      setEstado('enviado')
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'enviado') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">¡Gracias por escribirnos!</h1>
        <p className="mt-3 text-brasa/80">Tu mensaje llegó a la administración. Lo leemos todo y lo tomamos en cuenta para mejorar.</p>
        <Link to="/" className="boton mt-8">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold">Tu opinión</h1>
      <p className="mt-2 text-brasa/80">
        ¿Algo que podamos mejorar, un problema que tuviste o algo que te gustó? Escribinos. Este formulario es <strong>privado</strong>: lo lee
        solo la administración del restaurante y no se publica en ningún lado.
      </p>

      <form onSubmit={enviar} className="mt-8 space-y-6">
        <fieldset>
          <legend className="text-sm font-medium">¿Qué querés contarnos?</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {TIPOS.map((t) => (
              <label
                key={t.id}
                className={`cursor-pointer rounded-xl border px-4 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-naranja ${
                  tipo === t.id ? 'border-brasa bg-brasa text-hueso' : 'border-brasa/20 bg-white hover:border-naranja'
                }`}
              >
                <input type="radio" name="tipo" className="sr-only" checked={tipo === t.id} onChange={() => setTipo(t.id)} />
                <span className="block font-semibold">{t.t}</span>
                <span className={`block text-xs ${tipo === t.id ? 'text-hueso/70' : 'text-brasa/60'}`}>{t.d}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm font-medium">
          Tu mensaje
          <textarea
            className="campo mt-1"
            rows="6"
            required
            maxLength={MAX}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Contanos qué pasó o qué se puede mejorar. Si fue en una visita, podés decirnos el día y la mesa o el platillo."
          />
          <span className="mt-1 block text-right text-xs text-brasa/60">
            {mensaje.length}/{MAX}
          </span>
        </label>

        <div className="rounded-2xl bg-crema p-5">
          <p className="text-sm font-semibold">Opcional: solo si querés que te respondamos</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Tu nombre
              <input className="campo mt-1" maxLength={80} value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" />
            </label>
            <label className="block text-sm font-medium">
              Teléfono o correo
              <input className="campo mt-1" maxLength={120} value={contacto} onChange={(e) => setContacto(e.target.value)} autoComplete="email" />
            </label>
          </div>
          <p className="mt-3 text-xs text-brasa/70">
            Si lo dejás vacío, tu mensaje llega de forma anónima. Más información en la{' '}
            <Link className="underline" to="/privacidad">
              política de privacidad
            </Link>
            .
          </p>
        </div>

        {/* Trampa para bots: invisible para las personas */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            No llenar este campo
            <input tabIndex={-1} autoComplete="off" value={trampa} onChange={(e) => setTrampa(e.target.value)} />
          </label>
        </div>

        {aviso && (
          <p className="text-sm text-red-700" role="alert">
            {aviso}
          </p>
        )}
        {estado === 'error' && (
          <p className="text-sm text-red-700" role="alert">
            No pudimos enviar tu mensaje. Probá de nuevo en un momento o llamanos al {INFO.telefono}.
          </p>
        )}

        <button className="boton w-full sm:w-auto" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? 'Enviando…' : 'Enviar de forma privada'}
        </button>
      </form>
    </div>
  )
}
