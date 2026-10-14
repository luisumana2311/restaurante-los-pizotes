import EventoCard from '../components/EventoCard'
import { INFO } from '../lib/info'
import { useEventosProximos } from '../lib/data'

export default function Eventos() {
  const { eventos, cargando } = useEventosProximos()

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Eventos</h1>
      <p className="mt-2 text-brasa/70">Música en vivo, celebraciones y actividades en Restaurante Los Pizotes.</p>

      {cargando && <p className="mt-10">Cargando eventos…</p>}

      {!cargando && eventos.length === 0 && (
        <div className="mt-10 rounded-2xl bg-crema p-6">
          <p className="text-lg">
            No hay eventos programados por ahora. Seguinos en{' '}
            <a className="font-semibold underline" href={INFO.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>{' '}
            e{' '}
            <a className="font-semibold underline" href={INFO.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>{' '}
            para enterarte primero.
          </p>
        </div>
      )}

      <div className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventos.map((e) => (
          <EventoCard key={e.id} e={e} />
        ))}
      </div>
    </div>
  )
}
