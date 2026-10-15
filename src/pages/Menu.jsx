import { INFO } from '../lib/info'
import { NOTA_EMPAQUE } from '../lib/menuInicial'
import { formatoPrecio, useConfig, usarMenu } from '../lib/data'
import Especialidad from '../components/Especialidad'

export default function Menu() {
  const { grupos, cargando } = usarMenu()
  const { config, activo } = useConfig()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
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

      {grupos.length > 1 && (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Categorías del menú">
          {grupos.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full bg-crema px-4 py-1.5 text-sm font-medium hover:bg-naranja hover:text-white">
              {g.nombre}
            </a>
          ))}
        </nav>
      )}

      {grupos.map((g) => (
        <section key={g.id} id={g.id} className="mt-12 scroll-mt-24">
          <h2 className="border-b-2 border-naranja pb-2 text-2xl font-bold">{g.nombre}</h2>
          {g.descripcion && <p className="mt-2 text-brasa/70">{g.descripcion}</p>}
          <ul className="mt-4 divide-y divide-brasa/10">
            {g.platos.map((p) => (
              <li key={p.id} className="flex gap-4 py-4">
                {p.foto && (
                  <img
                    src={p.foto}
                    alt={p.nombre}
                    loading="lazy"
                    width="96"
                    height="96"
                    className="h-24 w-24 flex-none rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold">{p.nombre}</h3>
                    <span className="whitespace-nowrap font-semibold text-naranja-oscuro">
                      {formatoPrecio(p.precio)}
                    </span>
                  </div>
                  {p.descripcion && <p className="mt-1 text-brasa/80">{p.descripcion}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {grupos.length > 0 && <p className="mt-12 text-center text-sm text-brasa/70">{NOTA_EMPAQUE}</p>}
    </div>
  )
}
