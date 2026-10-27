// Iconos simples en línea (trazo), heredan el color del texto.
const base = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const IcoTelefono = (p) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
)
export const IcoCorreo = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)
export const IcoPin = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)
export const IcoReloj = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)
export const IcoFacebook = (p) => (
  <svg {...base} {...p}>
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8z" />
  </svg>
)
export const IcoInstagram = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r=".8" fill="currentColor" />
  </svg>
)
export const IcoWhatsapp = (p) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 18.8z" />
    <path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1.2-1.2-1.8-1-.8.6a3.5 3.5 0 0 1-1.7-1.7l.6-.8-1-1.8z" />
  </svg>
)
