import { useEffect, useState } from 'react'
import Carrusel from '../components/Carrusel'
import { grupos } from '../lib/grupos'

export default function Galeria() {
  const [abierta, setAbierta] = useState(null) // { g: índice de grupo, i: índice de foto }

  useEffect(() => {
    if (!abierta) return
    const total = grupos[abierta.g].fotos.length
    const onKey = (e) => {
      if (e.key === 'Escape') setAbierta(null)
      if (e.key === 'ArrowRight') setAbierta((a) => ({ ...a, i: (a.i + 1) % total }))
      if (e.key === 'ArrowLeft') setAbierta((a) => ({ ...a, i: (a.i - 1 + total) % total }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierta])

  const foto = abierta ? grupos[abierta.g].fotos[abierta.i] : null
  const total = abierta ? grupos[abierta.g].fotos.length : 0
  const paso = (d) => setAbierta((a) => ({ ...a, i: (a.i + d + total) % total }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Galería</h1>
      <p className="mt-2 text-brasa/70">Platos, bebidas y postres de Restaurante Los Pizotes.</p>

      <div className="mt-8 space-y-12">
        {grupos.map((g, gi) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="mb-3 border-l-4 border-naranja pl-3 text-2xl font-bold">
              {g.titulo}
            </h2>
            <Carrusel titulo={g.titulo} fotos={g.fotos} onAbrir={(i) => setAbierta({ g: gi, i })} />
          </section>
        ))}
      </div>

      {foto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={() => setAbierta(null)}
        >
          <img
            src={foto.src}
            alt={foto.alt}
            className="max-h-[88vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-hueso px-4 py-2 font-semibold"
            onClick={() => setAbierta(null)}
          >
            Cerrar
          </button>
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-hueso/95 text-2xl font-bold"
                onClick={(e) => {
                  e.stopPropagation()
                  paso(-1)
                }}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Foto siguiente"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-hueso/95 text-2xl font-bold"
                onClick={(e) => {
                  e.stopPropagation()
                  paso(1)
                }}
              >
                ›
              </button>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-hueso">
                {abierta.i + 1} / {total}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
