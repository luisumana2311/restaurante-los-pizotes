# Restaurante Los Pizotes — sitio web

React 18 + Vite + Tailwind 3 + React Router 7 + Firebase (plan Spark) + Netlify.

## Páginas
`/` Inicio · `/menu` · `/contacto` · `/privacidad` · `/cookies` · `/panel-admin` (protegido con Firebase Auth)

## Puesta en marcha
1. Crear un proyecto de Firebase **nuevo y dedicado** para Los Pizotes. Activar **Firestore** y **Authentication → Email/contraseña**.
2. Copiar `.env.example` a `.env.local` y pegar la config de la app web de Firebase.
3. En `firestore.rules` reemplazar `REEMPLAZAR_CORREO_DEL_DUENO@ejemplo.com` por el correo real del dueño y publicar las reglas (`firebase deploy --only firestore:rules`).
4. El **dueño crea su propia cuenta** desde la consola de Firebase (Authentication → Users → Add user). Después, en Authentication → Settings → User actions, desactivar la creación de cuentas por cuenta propia.
5. `npm install` y `npm run dev`.

## Deploy (Netlify)
- Conectar el repo de GitHub (rama `main`). Build: `npm run build`, publish: `dist`.
- Cargar las variables `VITE_FIREBASE_*` en Netlify (sin marcar "Contains secret values").
- `public/_redirects` ya está incluido (sin esto, las rutas distintas de `/` dan 404).

## Contenido
- El menú, la **especialidad del día**, los **eventos**, el horario, el WhatsApp y la foto de portada se editan desde `/panel-admin` (pestañas Menú, Especialidad del día, Eventos, Horario y contacto); no hay datos de ejemplo.
- **Módulos** (`config/sitio.modulos`): en la pestaña Módulos el dueño enciende o apaga Menú, Especialidad del día, Eventos y Galería. Apagar oculta el enlace, la página y las secciones del inicio sin borrar el contenido; por defecto todo está encendido.
- Especialidad del día (`config/sitio.especialidad`): tipo (día / fin de semana / semana), nombre, descripción, precio, foto y «Disponible hasta» opcional; se muestra en el inicio y arriba del menú, y desaparece sola al vencer.
- Eventos (colección `eventos`): nombre, fecha, hora, descripción y afiche; salen en `/eventos` y en el inicio mientras la fecha no haya pasado; se pueden ocultar, duplicar y borrar.
- Las fotos subidas se comprimen en el navegador (< ~300 KB) y se guardan en Firestore, sin Firebase Storage.
- Logo: poner `public/logo.png` y aparece en el encabezado.
- Colores provisionales sacados del logo: ajustar en `tailwind.config.js` cuando se confirmen.

## Pendiente antes de publicar
Favicons, Open Graph con imagen real, JSON-LD `Restaurant`, `sitemap.xml`/`robots.txt` con el dominio final, Google Analytics (opcional), Search Console.
