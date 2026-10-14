import { INFO } from '../lib/info'

export default function Cookies() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-bold">Política de cookies</h1>
      <p>
        Las cookies son pequeños archivos que un sitio guarda en tu navegador. Este sitio no usa
        cookies de publicidad ni de seguimiento propias.
      </p>
      <p>
        Los servicios incrustados (por ejemplo el mapa de Google Maps) y Firebase pueden usar
        almacenamiento técnico en tu navegador para funcionar. Podés borrarlo o bloquearlo desde la
        configuración de tu navegador; algunas partes del sitio podrían dejar de funcionar.
      </p>
      <p>
        Dudas:{' '}
        <a className="underline" href={`mailto:${INFO.correo}`}>
          {INFO.correo}
        </a>
        .
      </p>
    </div>
  )
}
