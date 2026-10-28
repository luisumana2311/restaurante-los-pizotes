import { useEffect, useMemo, useRef, useState } from 'react'
import { INFO } from '../lib/info'
import { GRUPOS, NOTA_EMPAQUE, esAngus, grupoDe } from '../lib/menuInicial'
import { formatoPrecio, useConfig, usarMenu } from '../lib/data'
import Especialidad from '../components/Especialidad'

const sinTildes = (t) => (t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function Plato({ p, categoria }) {
  return (
    <li className="flex gap-4 py-3 [break-inside:avoid]">
      {p.foto && (
        <img src={p.foto} alt={p.nombre} loading="lazy" width="80" height="80" className="h-20 w-20 flex-none rounded-xl object-cover" />
      )}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-texto font-semibold">{p.nombre}</h3>
          <span aria-hidden="true" className="min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-brasa/30" />
          <span className="whitespace-nowrap font-semibold text-naranja-oscuro">{formatoPrecio(p.precio)}</span>
        </div>
        {categoria && <p className="text-xs uppercase tracking-wide text-brasa/50">{categoria}</p>}
        {p.descripcion && <p className="mt-0.5 text-sm text-brasa/75">{p.descripcion}</p>}
      </div>
    </li>
  )
}

function Tarjeta({ g, abierta, alternar }) {
  const precios = g.platos.map((p) => Number(p.precio)).filter((n) => n > 0)
  const desde = precios.length ? Math.min(...precios) : null
  const larga = g.platos.length > 12
  return (
    <section id={g.id} className="scroll-mt-40 overflow-hidden rounded-2xl border border-naranja/40 bg-white shadow-sm">
      <h2>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-crema"
          aria-expanded={abierta}
          aria-controls={`panel-${g.id}`}
          onClick={alternar}
        >
          <span className="flex-1">
            <span className="block font-titulo text-xl font-bold">
              {g.nombre}
              {esAngus(g) && (
                <span className="ml-2 inline-block rounded-full bg-naranja-oscuro/10 px-2.5 py-0.5 align-middle font-texto text-xs font-semibold uppercase tracking-wide text-naranja-oscuro">
                  Certified Angus Beef®
                </span>
              )}
            </span>
            <span className="block text-sm text-brasa/60">
              {g.platos.length} {g.platos.length === 1 ? 'opción' : 'opciones'}
              {desde ? ` · desde ${formatoPrecio(desde)}` : ''}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-brasa text-hueso transition-transform ${abierta ? 'rotate-45' : ''}`}
          >
            +
          </span>
        </button>
      </h2>
      {abierta && (
        <div id={`panel-${g.id}`} className="border-t border-naranja/30 px-5 pb-3">
          {g.descripcion && <p className="pt-3 text-sm italic text-brasa/70">{g.descripcion}</p>}
          <ul className={`divide-y divide-brasa/10 ${larga ? 'md:columns-2 md:gap-10 md:divide-y-0' : ''}`}>
            {g.platos.map((p) => (
              <Plato key={p.id} p={p} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default function Menu() {
  const { grupos, cargando } = usarMenu()
  const { config, activo } = useConfig()
  const [seccion, setSeccion] = useState(null)
  const [abiertas, setAbiertas] = useState({})
  const [busca, setBusca] = useState('')
  const [avance, setAvance] = useState(0)
  const raiz = useRef(null)

  // Secciones (Para picar, Platos fuertes…) con sus categorías; "otros" solo si hay categorías sin sección.
  const secciones = useMemo(() => {
    const lista = GRUPOS.map((s) => ({ ...s, cats: grupos.filter((g) => grupoDe(g) === s.id) }))
    const otros = grupos.filter((g) => grupoDe(g) === 'otros')
    if (otros.length) lista.push({ id: 'otros', nombre: 'Otros', sub: '', cats: otros })
    return lista.filter((s) => s.cats.length > 0)
  }, [grupos])

  const actual = secciones.find((s) => s.id === seccion) || secciones[0]

  // Al entrar a una sección por primera vez se abre su primera categoría.
  useEffect(() => {
    if (actual && abiertas[actual.id] === undefined) {
      setAbiertas((a) => ({ ...a, [actual.id]: [actual.cats[0].id] }))
    }
  }, [actual, abiertas])

  // "Rabo del pizote": barra con anillos que avanza al recorrer la sección.
  useEffect(() => {
    function medir() {
      const el = raiz.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      setAvance(total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total)))
    }
    medir()
    window.addEventListener('scroll', medir, { passive: true })
    window.addEventListener('resize', medir)
    return () => {
      window.removeEventListener('scroll', medir)
      window.removeEventListener('resize', medir)
    }
  }, [actual, abiertas])

  const q = sinTildes(busca.trim())
  const resultados = useMemo(() => {
    if (!q) return []
    return grupos.flatMap((g) =>
      g.platos
        .filter((p) => sinTildes(p.nombre).includes(q) || sinTildes(p.descripcion).includes(q))
        .map((p) => ({ p, cat: g.nombre })),
    )
  }, [q, grupos])

  const idsAbiertos = actual ? abiertas[actual.id] || [] : []
  const alternar = (id) =>
    setAbiertas((a) => ({
      ...a,
      [actual.id]: idsAbiertos.includes(id) ? idsAbiertos.filter((x) => x !== id) : [...idsAbiertos, id],
    }))
  const todasAbiertas = actual && idsAbiertos.length === actual.cats.length

  return (
    <div ref={raiz} className="mx-auto max-w-4xl px-4 pb-16 pt-12">
      <h1 className="text-4xl font-bold">Menú</h1>
      <p className="mt-2 text-brasa/70">Restaurante Los Pizotes · Cervantes, Cartago</p>

      {activo('especialidad') && <Especialidad esp={config.especialidad} className="mt-6" />}

      {cargando && <p className="mt-10">Cargando menú…</p>}

      {!cargando && grupos.length === 0 && (
        <div className="mt-10 rounded-2xl bg-crema p-6">
          <p className="text-lg">
            Estamos actualizando nuestro menú en línea. Mientras tanto, llamanos al{' '}
            <a className="font-semibold underline" href={`tel:${INFO.telefonoLink}`}>
              {INFO.telefono}
            </a>{' '}
            o mirá las novedades en nuestras redes.
          </p>
          <p className="mt-3 flex gap-4">
            <a className="underline" href={INFO.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a className="underline" href={INFO.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          </p>
        </div>
      )}

      {grupos.length > 0 && (
        <>
          <label className="mt-8 block">
            <span className="sr-only">Buscar en el menú</span>
            <input
              type="search"
              className="campo !rounded-full !px-5 !py-3"
              placeholder="Buscar un plato o bebida (ej. camarones, café, ribeye)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </label>

          {!q && actual && (
            <div className="z-20 sm:sticky sm:top-[60px] -mx-4 mt-4 bg-hueso/95 px-4 pb-3 pt-2 backdrop-blur">
              <div role="tablist" aria-label="Secciones del menú" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {secciones.map((s) => {
                  const on = s.id === actual.id
                  return (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={on}
                      onClick={() => {
                        setSeccion(s.id)
                        window.scrollTo({ top: Math.max(0, (raiz.current?.offsetTop || 0) + 140), behavior: 'smooth' })
                      }}
                      className={`rounded-xl border px-3 py-2 text-left transition ${
                        on ? 'border-brasa bg-brasa text-hueso' : 'border-brasa/20 bg-white hover:border-naranja'
                      }`}
                    >
                      <span className="block font-titulo font-bold leading-tight">{s.nombre}</span>
                      <span className={`block text-xs ${on ? 'text-hueso/70' : 'text-brasa/60'}`}>{s.sub}</span>
                    </button>
                  )
                })}
              </div>
              {/* Rabo del pizote: los anillos del rabo se van llenando mientras recorrés la sección */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-crema" aria-hidden="true">
                <div
                  className="h-full rounded-full transition-[width] duration-150"
                  style={{
                    width: `${Math.max(avance * 100, 4)}%`,
                    backgroundImage: 'repeating-linear-gradient(90deg, #381914 0 12px, #fcefd9 12px 20px)',
                  }}
                />
              </div>
            </div>
          )}

          {q ? (
            <div className="mt-6" role="region" aria-live="polite" aria-label="Resultados de la búsqueda">
              <p className="text-sm text-brasa/70">
                {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'} para “{busca.trim()}”
              </p>
              {resultados.length > 0 ? (
                <ul className="mt-2 divide-y divide-brasa/10 rounded-2xl border border-naranja/40 bg-white px-5">
                  {resultados.map(({ p, cat }) => (
                    <Plato key={p.id} p={p} categoria={cat} />
                  ))}
                </ul>
              ) : (
                <p className="mt-4 rounded-2xl bg-crema p-5">
                  No encontramos nada con esa palabra. Probá con otra o llamanos al {INFO.telefono}.
                </p>
              )}
            </div>
          ) : (
            actual && (
              <div className="mt-4 space-y-3" role="tabpanel">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-brasa/70">{actual.cats.length} categorías</p>
                  <button
                    className="text-sm font-semibold text-naranja-oscuro underline"
                    onClick={() => setAbiertas((a) => ({ ...a, [actual.id]: todasAbiertas ? [] : actual.cats.map((c) => c.id) }))}
                  >
                    {todasAbiertas ? 'Cerrar todas' : 'Abrir todas'}
                  </button>
                </div>
                {actual.cats.map((g) => (
                  <Tarjeta key={g.id} g={g} abierta={idsAbiertos.includes(g.id)} alternar={() => alternar(g.id)} />
                ))}
              </div>
            )
          )}

          <p className="mt-12 text-center text-sm text-brasa/70">{NOTA_EMPAQUE}</p>
        </>
      )}
    </div>
  )
}
