import { formatoFecha } from '../lib/data'

export default function EventoCard({ e }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brasa/10">
      {e.foto && <img src={e.foto} alt={`Afiche: ${e.titulo}`} loading="lazy" className="w-full" />}
      <div className="p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-naranja-oscuro">{formatoFecha(e.fecha)}</p>
        <h3 className="mt-1 text-xl font-bold">{e.titulo}</h3>
        {e.hora && <p className="mt-1 text-brasa/70">{e.hora}</p>}
        {e.descripcion && <p className="mt-3 whitespace-pre-line">{e.descripcion}</p>}
      </div>
    </article>
  )
}
