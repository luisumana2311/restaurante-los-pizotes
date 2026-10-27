import { INFO } from '../lib/info'

export default function Privacidad() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed">
      <h1 className="text-4xl font-bold">Política de privacidad</h1>
      <p>
        En {INFO.nombre} respetamos tus datos personales conforme a la Ley N.° 8968 de Protección
        de la Persona frente al tratamiento de sus datos personales de Costa Rica.
      </p>
      <h2 className="pt-2 text-2xl font-bold">Qué datos recopilamos</h2>
      <p>
        Este sitio no te pide registrarte. Si usás el formulario privado de opiniones, guardamos lo que escribas (y, solo si querés, tu nombre y un medio de contacto); lo lee únicamente la administración del restaurante y no se publica. Además, recibimos los
        datos que vos nos envíes voluntariamente por teléfono, correo, WhatsApp o redes sociales
        cuando nos contactás.
      </p>
      <h2 className="pt-2 text-2xl font-bold">Para qué los usamos</h2>
      <p>Únicamente para responder tus consultas. No vendemos ni compartimos tus datos con terceros.</p>
      <h2 className="pt-2 text-2xl font-bold">Servicios de terceros</h2>
      <p>
        El sitio usa Google Maps para mostrar la ubicación y Google Fonts para las tipografías, y
        los datos del sitio se guardan en Google Firebase. Estos servicios tienen sus propias
        políticas de privacidad.
      </p>
      <h2 className="pt-2 text-2xl font-bold">Tus derechos</h2>
      <p>
        Tenés derecho de acceso, rectificación, cancelación y oposición (ARCO) sobre tus datos.
        Para ejercerlos escribinos a{' '}
        <a className="underline" href={`mailto:${INFO.correo}`}>
          {INFO.correo}
        </a>
        .
      </p>
    </div>
  )
}
