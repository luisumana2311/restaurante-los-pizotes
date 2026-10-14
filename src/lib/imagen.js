// Comprime una foto en el navegador y la devuelve como data URL (JPEG).
// Se guarda directo en Firestore (sin Firebase Storage) para quedarse en el plan gratis.
const MAX_BYTES = 300 * 1024

export async function comprimirImagen(archivo, anchoMax = 1200) {
  const url = URL.createObjectURL(archivo)
  try {
    const img = await new Promise((ok, fallo) => {
      const i = new Image()
      i.onload = () => ok(i)
      i.onerror = () => fallo(new Error('No se pudo leer la imagen'))
      i.src = url
    })
    let escala = Math.min(1, anchoMax / img.width)
    let calidad = 0.85
    for (let intento = 0; intento < 12; intento++) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/jpeg', calidad)
      // el base64 pesa ~4/3 del binario
      if (dataUrl.length * 0.75 <= MAX_BYTES) return dataUrl
      if (calidad > 0.5) calidad -= 0.1
      else escala *= 0.85
    }
    throw new Error('La imagen es demasiado pesada, probá con otra más pequeña')
  } finally {
    URL.revokeObjectURL(url)
  }
}
