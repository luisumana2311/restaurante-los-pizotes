import { INFO, linkWhatsApp } from '../lib/info'
import { useConfig } from '../lib/data'

export default function Contacto() {
  const { config } = useConfig()
  const wa = linkWhatsApp(config.whatsapp)
  const horario = Array.isArray(config.horario) ? config.horario.filter((h) => h.dias && h.horas) : []
  const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent('Restaurante Los Pizotes, ' + INFO.direccion)}&output=embed`

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-bold">Contacto</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold">Dirección</h2>
            <p className="mt-1">{INFO.direccion}</p>
            <a className="mt-2 inline-block font-semibold text-naranja-oscuro underline" href={INFO.mapa} target="_blank" rel="noreferrer">
              Abrir en Google Maps
            </a>
          </div>

          <div>
            <h2 className="text-xl font-bold">Horario</h2>
            {horario.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {horario.map((h, i) => (
                  <li key={i} className="flex justify-between gap-4 border-b border-brasa/10 py-1">
                    <span className="font-medium">{h.dias}</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1">
                Consultá nuestro horario actualizado en{' '}
                <a className="underline" href={INFO.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>{' '}
                o llamanos.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold">Escribinos o llamanos</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={`tel:${INFO.telefonoLink}`} className="boton">
                Llamar al {INFO.telefono}
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noreferrer" className="boton-claro">
                  WhatsApp
                </a>
              )}
              <a href={`mailto:${INFO.correo}`} className="boton-claro">
                {INFO.correo}
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold">Redes sociales</h2>
            <p className="mt-1 flex gap-4">
              <a className="underline" href={INFO.facebook} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a className="underline" href={INFO.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
          </div>
        </div>

        <div>
          <iframe
            title="Mapa de Restaurante Los Pizotes"
            src={mapaEmbed}
            className="h-96 w-full rounded-2xl border-0 md:h-full md:min-h-[24rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
