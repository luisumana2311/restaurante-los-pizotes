import { Link } from 'react-router-dom'
import { useConfig } from '../lib/config'

// Protege una página: si el dueño apagó el módulo, muestra un aviso en vez del contenido.
export default function Modulo({ clave, children }) {
  const { cargando, activo } = useConfig()

  // Mientras se lee la configuración no mostramos nada, para que una página apagada no parpadee.
  if (cargando) return <div className="min-h-[50vh]" aria-hidden="true" />

  if (!activo(clave)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Sección no disponible</h1>
        <p className="mt-3 text-brasa/70">Esta sección no está disponible por ahora.</p>
        <Link to="/" className="boton mt-6">
          Volver al inicio
        </Link>
      </div>
    )
  }
  return children
}
