import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Carrusel horizontal con scroll-snap: se desliza con el dedo/trackpad de forma nativa
 * y además tiene flechas y control con teclado (← →). Las fotos conservan su proporción.
 */
export default function Carrusel({ titulo, fotos, onAbrir }) {
  const pista = useRef(null)
  const [alInicio, setAlInicio] = useState(true)
  const [alFinal, setAlFinal] = useState(false)

  const actualizar = useCallback(() => {
    const el = pista.current
    if (!el) return
    setAlInicio(el.scrollLeft <= 4)
    setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = pista.current
    if (!el) return
    actualizar()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(actualizar)
    ro.observe(el)
    return () => ro.disconnect()
  }, [actualizar, fotos])

  function mover(dir) {
    const el = pista.current
    if (!el) return
    const sinAnimacion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: sinAnimacion ? 'auto' : 'smooth' })
  }

  function teclas(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      mover(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      mover(-1)
    }
  }

  const flecha =
    'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-hueso/95 text-xl font-bold text-brasa shadow transition hover:bg-naranja hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja disabled:pointer-events-none disabled:opacity-0 sm:flex'

  return (
    <div role="group" aria-roledescription="carrusel" aria-label={titulo} className="relative">
      <button type="button" className={`${flecha} left-2`} onClick={() => mover(-1)} disabled={alInicio} aria-label={`${titulo}: fotos anteriores`}>
        ‹
      </button>
      <button type="button" className={`${flecha} right-2`} onClick={() => mover(1)} disabled={alFinal} aria-label={`${titulo}: fotos siguientes`}>
        ›
      </button>

      <div
        ref={pista}
        onScroll={actualizar}
        onKeyDown={teclas}
        tabIndex={0}
        aria-label={`${titulo}, ${fotos.length} fotos. Usá las flechas del teclado para avanzar.`}
        className="flex h-64 snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-2xl pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja sm:h-80 md:h-96 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((f, i) => {
          const imagen = (
            <img
              src={f.src}
              alt={f.alt}
              width={f.w}
              height={f.h}
              loading={i < 2 ? 'eager' : 'lazy'}
              draggable="false"
              className="h-full w-auto max-w-none rounded-2xl object-cover"
            />
          )
          return onAbrir ? (
            <button
              key={f.src}
              type="button"
              onClick={() => onAbrir(i)}
              aria-label={`Ampliar: ${f.alt}`}
              className="h-full flex-none snap-start rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-naranja"
            >
              {imagen}
            </button>
          ) : (
            <div key={f.src} className="h-full flex-none snap-start">
              {imagen}
            </div>
          )
        })}
      </div>
    </div>
  )
}
