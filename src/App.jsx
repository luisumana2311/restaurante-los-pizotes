import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Menu from './pages/Menu'
import Contacto from './pages/Contacto'
import Galeria from './pages/Galeria'
import Eventos from './pages/Eventos'
import Modulo from './components/Modulo'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Admin from './pages/Admin'

function ScrollArriba() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    // No forzar scroll arriba si hay ancla (#seccion): rompería el scroll nativo.
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollArriba />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/menu" element={<Modulo clave="menu"><Menu /></Modulo>} />
          <Route path="/eventos" element={<Modulo clave="eventos"><Eventos /></Modulo>} />
          <Route path="/galeria" element={<Modulo clave="galeria"><Galeria /></Modulo>} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<Inicio />} />
        </Route>
        <Route path="/panel-admin" element={<Admin />} />
      </Routes>
    </>
  )
}
