import { esVigente, formatoFecha, formatoPrecio } from '../lib/data'

// Tarjeta de la especialidad del día. No muestra nada si no hay una vigente.
export default function Especialidad({ esp, className = '' }) {
  if (!esVigente(esp)) return null
  return (
    <section
      aria-label={esp.etiqueta || 'Especialidad del día'}
      className={`grid items-center gap-6 overflow-hidden rounded-2xl bg-crema ring-1 ring-naranja/30 ${esp.foto ? 'md:grid-cols-2' : ''} ${className}`}
    >
      {esp.foto && (
        <img src={esp.foto} alt={esp.titulo} loading="lazy" className="h-full max-h-96 w-full object-cover" />
      )}
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-naranja-oscuro">
          {esp.etiqueta || 'Especialidad del día'}
        </p>
        <h2 className="mt-2 text-3xl font-bold">{esp.titulo}</h2>
        {esp.descripcion && <p className="mt-3 whitespace-pre-line text-lg">{esp.descripcion}</p>}
        {esp.precio !== undefined && esp.precio !== '' && (
          <p className="mt-3 text-2xl font-semibold text-naranja-oscuro">{formatoPrecio(esp.precio)}</p>
        )}
        {esp.hasta && (
          <p className="mt-2 text-sm text-brasa/60">Disponible hasta el {formatoFecha(esp.hasta)}</p>
        )}
      </div>
    </section>
  )
}
