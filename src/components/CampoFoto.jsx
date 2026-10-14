import { useState } from 'react'
import { comprimirImagen } from '../lib/imagen'

// Selector de foto para el panel admin: comprime en el navegador y devuelve un data URL.
export default function CampoFoto({ valor, onCambio, etiqueta = 'Foto' }) {
  const [error, setError] = useState('')
  async function elegir(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setError('')
    try {
      onCambio(await comprimirImagen(f))
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <div className="text-sm font-medium">
      {etiqueta}
      <div className="mt-1 flex items-center gap-3">
        {valor && <img src={valor} alt="" className="h-16 w-16 rounded-lg object-cover" />}
        <input type="file" accept="image/*" onChange={elegir} className="text-sm" />
        {valor && (
          <button type="button" className="text-red-700 underline" onClick={() => onCambio('')}>
            Quitar
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-red-700">{error}</p>}
    </div>
  )
}
