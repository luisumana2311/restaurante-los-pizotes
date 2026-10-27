import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { INFO } from '../lib/info'
import { useConfig } from '../lib/config'

const enlaces = [
  { a: '/', t: 'Inicio' },
  { a: '/menu', t: 'Menú', m: 'menu' },
  { a: '/eventos', t: 'Eventos', m: 'eventos' },
  { a: '/galeria', t: 'Galería', m: 'galeria' },
  { a: '/contacto', t: 'Contacto' },
]

export default function Layout() {
  const [abierto, setAbierto] = useState(false)
  const { activo } = useConfig()
  const visibles = enlaces.filter((l) => !l.m || activo(l.m))
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-brasa text-hueso shadow">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setAbierto(false)}>
            <img
              src="/logo.png"
              alt=""
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span className="font-titulo text-xl font-bold">Los Pizotes</span>
          </Link>
          <nav className="hidden gap-6 md:flex" aria-label="Principal">
            {visibles.map((l) => (
              <NavLink
                key={l.a}
                to={l.a}
                end
                className={({ isActive }) =>
                  `py-1 font-medium transition hover:text-naranja ${isActive ? 'border-b-2 border-naranja' : ''}`
                }
              >
                {l.t}
              </NavLink>
            ))}
          </nav>
          <button
            className="rounded p-2 md:hidden"
            aria-label="Abrir menú de navegación"
            aria-expanded={abierto}
            onClick={() => setAbierto((v) => !v)}
          >
            <span className="block h-0.5 w-6 bg-hueso" />
            <span className="mt-1.5 block h-0.5 w-6 bg-hueso" />
            <span className="mt-1.5 block h-0.5 w-6 bg-hueso" />
          </button>
        </div>
        {abierto && (
          <nav className="border-t border-hueso/10 px-4 pb-3 md:hidden" aria-label="Principal móvil">
            {visibles.map((l) => (
              <NavLink
                key={l.a}
                to={l.a}
                end
                onClick={() => setAbierto(false)}
                className="block py-2 font-medium"
              >
                {l.t}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brasa text-hueso/80">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm md:grid-cols-3">
          <div>
            <p className="font-titulo text-lg text-hueso">{INFO.nombre}</p>
            <p className="mt-1">{INFO.direccion}</p>
          </div>
          <div>
            <p>
              Tel.{' '}
              <a className="underline" href={`tel:${INFO.telefonoLink}`}>
                {INFO.telefono}
              </a>
            </p>
            <p>
              <a className="underline" href={`mailto:${INFO.correo}`}>
                {INFO.correo}
              </a>
            </p>
            <p className="mt-2 flex gap-4">
              <a className="underline" href={INFO.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a className="underline" href={INFO.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
          </div>
          <div className="md:text-right">
            <p className="flex gap-4 md:justify-end">
              {activo('opiniones') && (
                <Link className="underline" to="/opinion">
                  Tu opinión
                </Link>
              )}
              <Link className="underline" to="/privacidad">
                Privacidad
              </Link>
              <Link className="underline" to="/cookies">
                Cookies
              </Link>
            </p>
            <p className="mt-2">© {new Date().getFullYear()} {INFO.nombre}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
