import { Link } from 'react-router-dom'
import Carrusel from '../components/Carrusel'
import Especialidad from '../components/Especialidad'
import EventoCard from '../components/EventoCard'
import { INFO, horarioDe, linkWhatsApp } from '../lib/info'
import { useConfig, useEventosProximos } from '../lib/data'
import { destacadas } from '../lib/grupos'

export default function Inicio() {
  const { config, activo } = useConfig()
  const { eventos } = useEventosProximos()
  const wa = linkWhatsApp(config.whatsapp)

  return (
    <>
      <section className="relative isolate flex flex-col overflow-hidden bg-brasa text-hueso lg:block">
        {/* Foto de la fachada. En celular va debajo del texto, entera; en pantalla grande va de fondo. */}
        <div className="relative order-last h-64 lg:absolute lg:inset-0 lg:-z-20 lg:h-auto">
          <img
            src={config.heroFoto || '/fotos/fachada-volcan.webp'}
            alt="Fachada del Restaurante Los Pizotes con el volcán Turrialba al fondo"
            fetchpriority="high"
            className="h-full w-full object-cover object-[80%_100%] lg:object-[60%_85%]"
            style={{ filter: 'saturate(1.05) contrast(1.03)' }}
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brasa to-transparent lg:hidden" aria-hidden="true" />
        </div>
        {/* Sombra suave solo a la izquierda, donde va el texto */}
        <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-brasa/65 via-brasa/20 to-transparent lg:block" aria-hidden="true" />
        <div className="w-full px-4 pb-6 pt-14 [text-shadow:0_2px_14px_rgba(40,18,12,.65)] md:px-10 lg:px-16 lg:pb-52 lg:pt-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-hueso">Cervantes de Cartago</p>
          <h1 className="max-w-md text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">Restaurante Los Pizotes</h1>
          <p className="mt-5 max-w-sm text-lg text-hueso/90">
            Platos típicos, cortes de pollo, res y cerdo, mariscos, café y cócteles en San Isidro de Cervantes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {activo('menu') && (
              <Link to="/menu" className="boton">
                Ver el menú
              </Link>
            )}
            <Link to="/contacto" className="boton-claro border-hueso/40 text-hueso hover:bg-hueso hover:text-brasa">
              Cómo llegar
            </Link>
            {activo('opiniones') && (
              <Link to="/opinion" className="boton-claro border-hueso/40 text-hueso hover:bg-hueso hover:text-brasa">
                Contanos tu opinión
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Especialidad del día: solo aparece si el dueño publicó una vigente */}
      <div className="mx-auto max-w-6xl px-4">
        {activo('especialidad') && <Especialidad esp={config.especialidad} className="mt-10" />}
      </div>

      {/* Próximos eventos: solo aparece si hay alguno publicado */}
      {activo('eventos') && eventos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14" aria-labelledby="titulo-eventos">
          <div className="flex items-end justify-between gap-4">
            <h2 id="titulo-eventos" className="text-3xl font-bold">
              Próximos eventos
            </h2>
            <Link to="/eventos" className="font-semibold text-naranja-oscuro underline">
              Ver todos
            </Link>
          </div>
          <div className="mt-6 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.slice(0, 3).map((e) => (
              <EventoCard key={e.id} e={e} />
            ))}
          </div>
        </section>
      )}

      {activo('galeria') && (
        <section className="mx-auto max-w-6xl px-4 pt-14" aria-labelledby="titulo-galeria">
          <div className="flex items-end justify-between gap-4">
            <h2 id="titulo-galeria" className="text-3xl font-bold">
              De nuestra cocina
            </h2>
            <Link to="/galeria" className="font-semibold text-naranja-oscuro underline">
              Ver todas las fotos
            </Link>
          </div>
          <div className="mt-6">
            <Carrusel titulo="De nuestra cocina" fotos={destacadas} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Te esperamos en Cervantes</h2>
            <p className="mt-4 text-lg">
              Un restaurante lleno de sabores, con platos típicos, cortes y mariscos, además de café y cócteles.
              Consumo en el local y recogida desde el carro.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {activo('menu') && (
                <Link to="/menu" className="boton">
                  Ver el menú
                </Link>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="boton-claro">
                  Escribinos por WhatsApp
                </a>
              )}
              <a href={`tel:${INFO.telefonoLink}`} className="boton-claro">
                Llamar al {INFO.telefono}
              </a>
            </div>
          </div>
          <div className="rounded-2xl bg-crema p-6">
            <h3 className="text-xl font-bold">Dónde estamos</h3>
            <p className="mt-2">{INFO.direccion}</p>
            <h3 className="mt-5 text-xl font-bold">Horario</h3>
            <ul className="mt-2 space-y-1">
              {horarioDe(config).map((h, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>{h.dias}</span>
                  <span className="whitespace-nowrap font-medium">{h.horas}</span>
                </li>
              ))}
            </ul>
            <a className="mt-3 inline-block font-semibold text-naranja-oscuro underline" href={INFO.mapa} target="_blank" rel="noreferrer">
              Abrir en Google Maps
            </a>
            <p className="mt-5 text-sm">
              Seguinos en{' '}
              <a className="underline" href={INFO.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>{' '}
              e{' '}
              <a className="underline" href={INFO.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
