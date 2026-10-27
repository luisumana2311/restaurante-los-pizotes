import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { INFO, diasDeFila, estadoAhora, horarioDe, linkWhatsApp } from '../lib/info'
import { useConfig } from '../lib/data'
import { por } from '../lib/grupos'
import { IcoCorreo, IcoFacebook, IcoInstagram, IcoPin, IcoReloj, IcoTelefono, IcoWhatsapp } from '../components/Iconos'

// Mosaico de platos y bebidas (fotos de /public/fotos)
const mosaico = por(15, 3, 28, 26, 2, 30)

function Tarjeta({ icono, titulo, children }) {
  return (
    <div className="rounded-2xl border border-naranja/30 bg-white p-6 shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brasa text-hueso">{icono}</span>
      <h2 className="mt-4 text-xl font-bold">{titulo}</h2>
      {children}
    </div>
  )
}

export default function Contacto() {
  const { config, activo } = useConfig()
  const wa = linkWhatsApp(config.whatsapp)
  const horario = horarioDe(config)
  const [, setTic] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTic((n) => n + 1), 60000) // refresca «abierto ahora»
    return () => clearInterval(id)
  }, [])
  const estado = estadoAhora(horario)

  const consulta = encodeURIComponent('Restaurante Los Pizotes, ' + INFO.direccion)
  const mapaEmbed = `https://www.google.com/maps?q=${consulta}&output=embed`
  const waze = `https://waze.com/ul?q=${encodeURIComponent('Restaurante Los Pizotes Cervantes')}&navigate=yes`

  return (
    <>
      {/* Portada con la fachada */}
      <section className="relative isolate flex min-h-[18rem] items-end overflow-hidden bg-brasa text-hueso md:min-h-[24rem]">
        <img
          src="/fotos/fachada-volcan.webp"
          alt="Fachada del Restaurante Los Pizotes con el volcán Turrialba al fondo"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_80%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brasa via-brasa/40 to-transparent" aria-hidden="true" />
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-20 [text-shadow:0_2px_14px_rgba(40,18,12,.6)] md:pb-28">
          <p className="text-sm font-semibold uppercase tracking-widest">Contacto</p>
          <h1 className="mt-2 max-w-xl text-4xl font-bold leading-tight md:text-5xl">Visitanos en Cervantes</h1>
          {estado && (
            <p
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold [text-shadow:none] ${
                estado.abierto ? 'bg-green-100 text-green-900' : 'bg-hueso text-brasa'
              }`}
              role="status"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${estado.abierto ? 'bg-green-600' : 'bg-red-600'}`} aria-hidden="true" />
              {estado.texto}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Tres vías de contacto, montadas sobre la portada */}
        <div className="relative z-10 -mt-16 grid gap-4 md:grid-cols-3">
          <Tarjeta icono={<IcoTelefono />} titulo="Llamanos">
            <p className="mt-1 text-2xl font-bold text-naranja-oscuro">{INFO.telefono}</p>
            <p className="mt-1 text-sm text-brasa/70">Para reservar o consultar por el menú.</p>
            <a href={`tel:${INFO.telefonoLink}`} className="boton mt-4 w-full">
              Llamar ahora
            </a>
          </Tarjeta>

          <Tarjeta icono={wa ? <IcoWhatsapp /> : <IcoCorreo />} titulo="Escribinos">
            <p className="mt-1 break-all font-semibold text-naranja-oscuro">{INFO.correo}</p>
            <p className="mt-1 text-sm text-brasa/70">Te respondemos lo antes posible.</p>
            <div className="mt-4 flex flex-col gap-2">
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="boton w-full">
                  WhatsApp
                </a>
              )}
              <a href={`mailto:${INFO.correo}`} className={`${wa ? 'boton-claro' : 'boton'} w-full`}>
                Enviar un correo
              </a>
            </div>
          </Tarjeta>

          <Tarjeta icono={<IcoFacebook />} titulo="Seguinos">
            <p className="mt-1 text-sm text-brasa/70">Platos del día, eventos y novedades.</p>
            <div className="mt-4 flex flex-col gap-2">
              <a href={INFO.facebook} target="_blank" rel="noreferrer" className="boton-claro w-full gap-2">
                <IcoFacebook width="20" height="20" /> Facebook
              </a>
              <a href={INFO.instagram} target="_blank" rel="noreferrer" className="boton-claro w-full gap-2">
                <IcoInstagram width="20" height="20" /> Instagram
              </a>
            </div>
          </Tarjeta>
        </div>

        {/* Horario + mapa */}
        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl bg-crema p-6">
              <h2 className="flex items-center gap-3 text-2xl font-bold">
                <IcoReloj className="text-naranja-oscuro" /> Horario
              </h2>
              {horario.length > 0 ? (
                <ul className="mt-4 divide-y divide-brasa/10">
                  {horario.map((h, i) => {
                    const hoy = estado && diasDeFila(h).includes(estado.hoy)
                    return (
                      <li
                        key={i}
                        className={`flex items-center justify-between gap-3 py-3 ${hoy ? 'font-bold text-naranja-oscuro' : ''}`}
                      >
                        <span>
                          {h.dias}
                          {hoy && <span className="ml-2 rounded-full bg-naranja-oscuro px-2 py-0.5 text-xs font-semibold text-white">Hoy</span>}
                        </span>
                        <span className="whitespace-nowrap">{h.horas}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-3">Consultá nuestro horario en Facebook o llamanos.</p>
              )}
            </div>

            <div className="rounded-2xl bg-brasa p-6 text-hueso">
              <h2 className="flex items-center gap-3 text-2xl font-bold">
                <IcoPin className="text-naranja" /> Cómo llegar
              </h2>
              <p className="mt-3 text-hueso/90">{INFO.direccion}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href={INFO.mapa} target="_blank" rel="noreferrer" className="boton !bg-naranja hover:!bg-hueso hover:!text-brasa">
                  Google Maps
                </a>
                <a href={waze} target="_blank" rel="noreferrer" className="boton-claro border-hueso/40 text-hueso hover:bg-hueso hover:text-brasa">
                  Waze
                </a>
              </div>
              <p className="mt-4 text-sm text-hueso/70">Consumo en el local y recogida desde el carro.</p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <iframe
              title="Mapa de Restaurante Los Pizotes"
              src={mapaEmbed}
              className="h-96 w-full rounded-2xl border-0 shadow-sm lg:h-full lg:min-h-[30rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Mosaico de fotos */}
        <section className="mt-16" aria-labelledby="titulo-mesa">
          <h2 id="titulo-mesa" className="text-3xl font-bold">
            Te esperamos con la mesa servida
          </h2>
          <p className="mt-2 max-w-xl text-brasa/75">Cortes, mariscos, postres y bebidas preparados en Cervantes, con vista a la montaña.</p>
          <div className="mt-6 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[13rem] md:grid-cols-4">
            {mosaico.map((f, i) => (
              <img
                key={f.src}
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className={`h-full w-full rounded-2xl object-cover ${i === 0 || i === 2 ? 'row-span-2' : ''}`}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {activo('menu') && (
              <Link to="/menu" className="boton">
                Ver el menú
              </Link>
            )}
            {activo('galeria') && (
              <Link to="/galeria" className="boton-claro">
                Ver más fotos
              </Link>
            )}
          </div>
        </section>

        {/* Invitación a opinar */}
        {activo('opiniones') && (
          <section className="mt-16 flex flex-col items-center gap-5 rounded-3xl bg-brasa p-8 text-center text-hueso md:flex-row md:text-left">
            <img src="/logo.png" alt="" width="88" height="88" className="h-20 w-20 flex-none rounded-full md:h-24 md:w-24" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">¿Cómo estuvo tu visita?</h2>
              <p className="mt-1 text-hueso/85">Si algo se puede mejorar o querés felicitarnos, escribinos en privado. Leemos todo.</p>
            </div>
            <Link to="/opinion" className="boton !bg-naranja hover:!bg-hueso hover:!text-brasa">
              Contanos tu opinión
            </Link>
          </section>
        )}
      </div>
    </>
  )
}
