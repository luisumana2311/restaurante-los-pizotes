import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { auth, db, firebaseListo } from '../lib/firebase'
import { useConfig, usarMenu, formatoPrecio } from '../lib/data'
import CampoFoto from '../components/CampoFoto'
import { GRUPOS, MENU_INICIAL, grupoDe } from '../lib/menuInicial'
import EditorEspecialidad from './admin/EditorEspecialidad'
import EditorEventos from './admin/EditorEventos'
import EditorModulos from './admin/EditorModulos'

/* ---------- Login ---------- */
function Login() {
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await signInWithEmailAndPassword(auth, correo, clave)
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-2xl bg-white p-6 shadow">
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <p className="mt-1 text-sm text-brasa/70">Restaurante Los Pizotes</p>
      <form onSubmit={entrar} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Correo
          <input className="campo mt-1" type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)} autoComplete="username" />
        </label>
        <label className="block text-sm font-medium">
          Contraseña
          <input className="campo mt-1" type="password" required value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
        <button className="boton w-full" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

/* ---------- Menú ---------- */
function EditorMenu() {
  const { categorias, items } = usarMenu()
  const [nuevaCat, setNuevaCat] = useState('')
  const [nuevoGrupo, setNuevoGrupo] = useState('fuerte')
  const [editando, setEditando] = useState(null) // plato (con id o sin id) en edición
  const [msg, setMsg] = useState('')

  const totalInicial = MENU_INICIAL.reduce((n, c) => n + c.platos.length, 0)

  // Carga el menú del PDF 2025-2026 (solo si todavía no hay categorías, para no duplicar).
  async function cargarMenuInicial() {
    if (categorias.length > 0) return
    if (!window.confirm(`Se van a cargar ${MENU_INICIAL.length} categorías y ${totalInicial} platos del menú 2025-2026. ¿Continuar?`)) return
    setMsg('Cargando menú…')
    try {
      const ops = []
      MENU_INICIAL.forEach((c, i) => {
        const cRef = doc(collection(db, 'menuCategorias'))
        ops.push([cRef, { nombre: c.nombre, descripcion: c.descripcion || '', grupo: c.grupo, orden: i }])
        c.platos.forEach(([nombre, precio, descripcion], j) => {
          ops.push([
            doc(collection(db, 'menuItems')),
            { categoriaId: cRef.id, nombre, descripcion: descripcion || '', precio, foto: '', disponible: true, orden: j },
          ])
        })
      })
      for (let k = 0; k < ops.length; k += 400) {
        const lote = writeBatch(db)
        ops.slice(k, k + 400).forEach(([ref, datos]) => lote.set(ref, datos))
        await lote.commit()
      }
      setMsg('Menú cargado. Ya podés editar precios, ocultar platos o agregar fotos.')
    } catch {
      setMsg('No se pudo cargar el menú. Revisá que hayas iniciado sesión con la cuenta autorizada y que las reglas estén publicadas.')
    }
  }

  async function agregarCategoria(e) {
    e.preventDefault()
    if (!nuevaCat.trim()) return
    await addDoc(collection(db, 'menuCategorias'), { nombre: nuevaCat.trim(), grupo: nuevoGrupo, orden: categorias.length })
    setNuevaCat('')
  }
  async function borrarCategoria(c) {
    const platos = items.filter((i) => i.categoriaId === c.id)
    if (!window.confirm(`¿Borrar la categoría "${c.nombre}" y sus ${platos.length} platos?`)) return
    await Promise.all(platos.map((p) => deleteDoc(doc(db, 'menuItems', p.id))))
    await deleteDoc(doc(db, 'menuCategorias', c.id))
  }
  async function guardarPlato(e) {
    e.preventDefault()
    const { id, ...datos } = editando
    const limpio = {
      categoriaId: datos.categoriaId,
      nombre: (datos.nombre || '').trim(),
      descripcion: (datos.descripcion || '').trim(),
      precio: datos.precio === '' || datos.precio === undefined ? '' : Number(datos.precio),
      foto: datos.foto || '',
      disponible: datos.disponible !== false,
      orden: datos.orden ?? items.filter((i) => i.categoriaId === datos.categoriaId).length,
    }
    try {
      if (id) await updateDoc(doc(db, 'menuItems', id), limpio)
      else await addDoc(collection(db, 'menuItems'), limpio)
      setEditando(null)
      setMsg('Guardado.')
    } catch {
      setMsg('No se pudo guardar. Revisá tu conexión y que tu cuenta tenga permiso.')
    }
  }
  async function alternar(p) {
    await updateDoc(doc(db, 'menuItems', p.id), { disponible: p.disponible === false })
  }
  async function borrarPlato(p) {
    if (window.confirm(`¿Borrar "${p.nombre}"?`)) await deleteDoc(doc(db, 'menuItems', p.id))
  }

  return (
    <div className="space-y-8">
      <form onSubmit={agregarCategoria} className="flex gap-2">
        <input className="campo" placeholder="Nueva categoría (ej. Cortes, Mariscos, Bebidas)" value={nuevaCat} onChange={(e) => setNuevaCat(e.target.value)} />
        <select className="campo w-auto" aria-label="Sección del menú" value={nuevoGrupo} onChange={(e) => setNuevoGrupo(e.target.value)}>
          {GRUPOS.map((g) => (
            <option key={g.id} value={g.id}>{g.nombre}</option>
          ))}
        </select>
        <button className="boton whitespace-nowrap">Agregar</button>
      </form>
      {msg && <p className="text-sm" role="status">{msg}</p>}

      {categorias.length === 0 && (
        <div className="rounded-2xl bg-crema p-5">
          <p className="font-semibold">Todavía no hay categorías.</p>
          <p className="mt-1 text-sm">
            Podés crear la primera arriba, o cargar de una vez el menú impreso 2025-2026 ({MENU_INICIAL.length} categorías, {totalInicial} platos).
          </p>
          <button type="button" className="boton mt-3" onClick={cargarMenuInicial}>
            Cargar menú inicial
          </button>
        </div>
      )}

      {categorias.map((c) => {
        const platos = items.filter((i) => i.categoriaId === c.id).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
        return (
          <section key={c.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold">{c.nombre}</h3>
              <div className="flex items-center gap-3 text-sm">
                <select
                  className="rounded border border-brasa/25 bg-white px-2 py-1"
                  aria-label={`Sección de ${c.nombre}`}
                  value={grupoDe(c)}
                  onChange={(e) => updateDoc(doc(db, 'menuCategorias', c.id), { grupo: e.target.value })}
                >
                  {GRUPOS.map((g) => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                  {grupoDe(c) === 'otros' && <option value="otros">Otros</option>}
                </select>
                <button className="underline" onClick={() => setEditando({ categoriaId: c.id, nombre: '', descripcion: '', precio: '', foto: '', disponible: true })}>
                  + Plato
                </button>
                <button className="text-red-700 underline" onClick={() => borrarCategoria(c)}>
                  Borrar categoría
                </button>
              </div>
            </div>
            <ul className="mt-3 divide-y divide-brasa/10">
              {platos.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  {p.foto && <img src={p.foto} alt="" className="h-12 w-12 rounded-lg object-cover" />}
                  <div className={`flex-1 ${p.disponible === false ? 'opacity-50' : ''}`}>
                    <p className="font-medium">{p.nombre}</p>
                    <p className="text-sm text-brasa/70">{formatoPrecio(p.precio)}</p>
                  </div>
                  <button className="text-sm underline" onClick={() => alternar(p)}>
                    {p.disponible === false ? 'Mostrar' : 'Ocultar'}
                  </button>
                  <button className="text-sm underline" onClick={() => setEditando(p)}>Editar</button>
                  <button className="text-sm text-red-700 underline" onClick={() => borrarPlato(p)}>Borrar</button>
                </li>
              ))}
              {platos.length === 0 && <li className="py-2 text-sm text-brasa/60">Sin platos todavía.</li>}
            </ul>
          </section>
        )
      })}

      {editando && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <form onSubmit={guardarPlato} className="max-h-[90vh] w-full max-w-md space-y-4 overflow-y-auto rounded-2xl bg-white p-6">
            <h3 className="text-xl font-bold">{editando.id ? 'Editar plato' : 'Nuevo plato'}</h3>
            <label className="block text-sm font-medium">
              Nombre
              <input className="campo mt-1" required value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Descripción (opcional)
              <textarea className="campo mt-1" rows="3" value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </label>
            <label className="block text-sm font-medium">
              Precio en colones (solo número)
              <input className="campo mt-1" type="number" min="0" step="1" value={editando.precio} onChange={(e) => setEditando({ ...editando, precio: e.target.value })} />
            </label>
            <CampoFoto valor={editando.foto} onCambio={(f) => setEditando({ ...editando, foto: f })} />
            <div className="flex justify-end gap-3">
              <button type="button" className="boton-claro" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="boton">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

/* ---------- Horario, contacto y portada ---------- */
function EditorSitio({ config }) {
  const [horario, setHorario] = useState([])
  const [whatsapp, setWhatsapp] = useState('')
  const [heroFoto, setHeroFoto] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setHorario(Array.isArray(config.horario) ? config.horario : [])
    setWhatsapp(config.whatsapp || '')
    setHeroFoto(config.heroFoto || '')
  }, [config])

  async function guardar(e) {
    e.preventDefault()
    try {
      await setDoc(
        doc(db, 'config', 'sitio'),
        { horario: horario.filter((h) => h.dias?.trim() && h.horas?.trim()), whatsapp: whatsapp.trim(), heroFoto },
        { merge: true },
      )
      setMsg('Guardado.')
    } catch {
      setMsg('No se pudo guardar. Revisá tu conexión y que tu cuenta tenga permiso.')
    }
  }
  const cambiar = (i, campo, v) => setHorario(horario.map((h, j) => (j === i ? { ...h, [campo]: v } : h)))

  return (
    <form onSubmit={guardar} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Horario</h3>
        <p className="text-sm text-brasa/70">Ej.: «Lunes a viernes» — «11:00 a. m. a 8:00 p. m.»</p>
        <div className="mt-3 space-y-2">
          {horario.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input className="campo" placeholder="Días" value={h.dias || ''} onChange={(e) => cambiar(i, 'dias', e.target.value)} />
              <input className="campo" placeholder="Horas" value={h.horas || ''} onChange={(e) => cambiar(i, 'horas', e.target.value)} />
              <button type="button" className="text-red-700 underline" onClick={() => setHorario(horario.filter((_, j) => j !== i))}>
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="mt-2 underline" onClick={() => setHorario([...horario, { dias: '', horas: '' }])}>
          + Agregar fila
        </button>
      </div>

      <label className="block text-sm font-medium">
        WhatsApp (con código de país, ej. 50688888888). Dejalo vacío si no usan WhatsApp: el botón no se muestra.
        <input className="campo mt-1" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} inputMode="numeric" />
      </label>

      <CampoFoto etiqueta="Foto de portada (página de inicio)" valor={heroFoto} onCambio={setHeroFoto} />

      <button className="boton">Guardar cambios</button>
      {msg && <p className="text-sm" role="status">{msg}</p>}
    </form>
  )
}

/* ---------- Panel ---------- */
export default function Admin() {
  const [usuario, setUsuario] = useState(undefined)
  const [tab, setTab] = useState('menu')
  const { config } = useConfig()

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (u) => setUsuario(u))
  }, [])

  if (!firebaseListo) {
    return (
      <div className="mx-auto mt-20 max-w-md rounded-2xl bg-white p-6 shadow">
        <h1 className="text-xl font-bold">Panel no disponible</h1>
        <p className="mt-2">Falta configurar Firebase (variables VITE_FIREBASE_* del archivo .env.local o de Netlify).</p>
      </div>
    )
  }
  if (usuario === undefined) return <p className="p-10">Cargando…</p>
  if (!usuario) return <Login />

  const tabs = [
    ['menu', 'Menú'],
    ['especialidad', 'Especialidad del día'],
    ['eventos', 'Eventos'],
    ['sitio', 'Horario y contacto'],
    ['modulos', 'Módulos'],
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Panel · Los Pizotes</h1>
        <div className="flex gap-4 text-sm">
          <Link className="underline" to="/">Ver sitio</Link>
          <button className="underline" onClick={() => signOut(auth)}>Salir</button>
        </div>
      </header>
      <nav className="mt-6 flex gap-2 overflow-x-auto whitespace-nowrap border-b border-brasa/15" aria-label="Secciones del panel">
        {tabs.map(([k, t]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`-mb-px border-b-2 px-4 py-2 font-medium ${tab === k ? 'border-naranja text-naranja-oscuro' : 'border-transparent'}`}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="mt-6">
        {tab === 'menu' && <EditorMenu />}
        {tab === 'sitio' && <EditorSitio config={config} />}
        {tab === 'especialidad' && <EditorEspecialidad />}
        {tab === 'eventos' && <EditorEventos />}
        {tab === 'modulos' && <EditorModulos />}
      </div>
    </div>
  )
}
