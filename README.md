# 🏠 Vibes — Frontend

Aplicación web para la plataforma **Vibes**, un sistema de alquiler de propiedades de corto plazo. Construida con **React 19** y **Vite**, con un diseño moderno completamente custom (sin librerías de UI externas para los componentes principales).

---

## 📦 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 + Vite 7 |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| UI Base | React Bootstrap + Bootstrap 5 |
| Iconos | Bootstrap Icons + React Icons |
| Notificaciones | React Toastify |
| Deployment | Vercel |

---

## 🗂️ Estructura del Proyecto

```
src/
├── api/                        # Servicios HTTP (Axios)
│   ├── api.js                  # Instancia Axios + interceptores JWT
│   ├── authService.js          # Login y registro
│   ├── casas_service.js
│   ├── casa_imagenes_service.js
│   ├── hosts_service.js
│   ├── personas_service.js
│   ├── reservas_service.js
│   └── users_service.js
│
├── context/                    # Estado global (React Context)
│   ├── AuthContext.jsx         # Sesión de usuario + JWT
│   ├── ChatContext.jsx         # Historial del chatbot
│   ├── LoginModalContext.jsx   # Control del modal de login global
│   └── ModeContext.jsx         # Modo cliente / anfitrión
│
├── hooks/                      # Custom hooks de datos
│   ├── useCasas.js
│   ├── useCasasConImagen.js    # Casas + imagen principal en paralelo
│   ├── useHosts.js
│   ├── usePersonas.js
│   ├── usePersonasDisponibles.js
│   ├── useReservas.js
│   ├── useUsers.js
│   └── useUsersDisponibles.js
│
├── pages/                      # Vistas principales
│   ├── Inicio_page.jsx         # Chat fullscreen (página de inicio)
│   ├── Vitrina_casas.jsx       # Catálogo público de casas
│   ├── Detalle_casa.jsx        # Detalle + galería + reserva
│   ├── Mis_reservas.jsx        # Reservas del huésped
│   ├── Panel_host.jsx          # Panel del anfitrión
│   ├── Reservas_anfitrion.jsx  # Reservas recibidas por el host
│   ├── Perfil_page.jsx         # Perfil editable del usuario
│   ├── Login_page.jsx          # Página de login/registro (legacy)
│   ├── Adm_casas.jsx           # Admin: gestión de casas
│   ├── Adm_hosts.jsx           # Admin: gestión de hosts
│   ├── Adm_personas.jsx        # Admin: gestión de personas
│   ├── Adm_reservas.jsx        # Admin: gestión de reservas
│   └── Adm_users.jsx           # Admin: gestión de usuarios
│
├── components/                 # Componentes reutilizables
│   ├── NavbarDesktop.jsx       # Navbar responsivo con lógica de rol
│   ├── Footer.jsx
│   ├── Chatbot.jsx             # Chat flotante
│   ├── ChatFullscreen.jsx      # Chat de pantalla completa (inicio)
│   ├── Modal_login.jsx         # Modal de login/registro global
│   ├── Modal_casas.jsx         # CRUD de casas (admin)
│   ├── Modal_casa_host.jsx     # CRUD de casas (anfitrión)
│   ├── Modal_imagenes.jsx      # Gestión de imágenes con drag & drop
│   ├── Modal_reservar.jsx      # Reserva con cálculo automático
│   ├── Modal_reservas.jsx      # CRUD de reservas (admin)
│   ├── Modal_hosts.jsx         # CRUD de hosts (admin)
│   ├── Modal_personas.jsx      # CRUD de personas (admin)
│   ├── Modal_user.jsx          # CRUD de usuarios (admin)
│   ├── ModalConvierteteAnfitrion.jsx  # Flujo para ser host
│   ├── BotonHazteAnfitrion.jsx
│   ├── ModeToggle.jsx          # Toggle cliente / anfitrión
│   ├── ProtectedRoute.jsx      # Guard de rutas por autenticación/rol
│   └── ModeProtectedRoute.jsx  # Guard de rutas por modo activo
│
└── utils/
    └── tokenStorage.js         # Abstracción de localStorage para JWT
```

---

## 🚀 Instalación y Ejecución

### Requisitos

- Node.js >= 18
- Backend de Vibes corriendo (local o en Railway)

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd vite_front_react
npm install
```

### 2. Configurar la URL del backend

En `src/api/api.js`, ajustar la `baseURL` según el entorno:

```js
const api = axios.create({
  // Producción
  baseURL: "https://vibesbackendnestjs-production.up.railway.app",

  // Desarrollo local
  // baseURL: "http://localhost:3000",
});
```

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### 4. Build de producción

```bash
npm run build
```

---

## 🔐 Autenticación y Sesión

El token JWT se persiste en `localStorage` a través de `tokenStorage.js`. Al iniciar la app, `AuthContext` recupera la sesión automáticamente.

El interceptor de Axios en `api.js` adjunta el token a cada petición:

```
Authorization: Bearer <token>
```

Si el servidor responde con `401` en cualquier ruta que no sea `/login` o `/register`, la sesión se limpia automáticamente y el usuario es redirigido al inicio.

---

## 👥 Sistema de Roles y Modos

### Roles

| Rol | Acceso |
|-----|--------|
| Visitante | Catálogo de casas, detalle, chat |
| Usuario registrado | Todo lo anterior + reservas + perfil |
| Host | Todo lo anterior + panel de anfitrión + gestión de casas |
| Admin | Todo + panel de administración completo |

### Modos (solo para hosts)

Un usuario que también es host puede alternar entre dos modos desde el navbar:

- **Modo Cliente** — Ve el catálogo, sus reservas y su perfil.
- **Modo Anfitrión** — Ve sus propiedades y las reservas recibidas.

El modo activo se persiste en `localStorage` (`vibes_user_mode`) y se gestiona a través de `ModeContext`.

---

## 🗺️ Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Chat fullscreen (página de inicio) |
| `/casas` | Público | Catálogo de propiedades con filtros |
| `/casas/:id` | Público | Detalle de casa + galería + reserva |
| `/mis_reservas` | Auth + Modo Cliente | Reservas del huésped |
| `/perfil` | Auth | Perfil editable del usuario |
| `/mi-panel` | Auth + Host + Modo Host | Panel del anfitrión |
| `/reservas-anfitrion` | Auth + Host + Modo Host | Reservas recibidas |
| `/adm_users` | Auth + Admin | Gestión de usuarios |
| `/adm_clientes` | Auth + Admin | Gestión de personas |
| `/adm_hosts` | Auth + Admin | Gestión de hosts |
| `/adm_casas` | Auth + Admin | Gestión de casas + imágenes |
| `/adm_reservas` | Auth + Admin | Gestión de reservas |

---

## 💬 Chatbot

La página de inicio es un chat fullscreen que conecta con el backend Python de Vibes:

```
POST https://vibeschatbotpython-production.up.railway.app/chat
Body: { message: string, history: [{ role, content }] }
```

El historial completo de la conversación se envía en cada petición para mantener el contexto. El chatbot puede devolver casas recomendadas que se renderizan como tarjetas clicables dentro del chat.

El mismo chatbot está disponible como **widget flotante** en el resto de páginas (`Chatbot.jsx`), compartiendo el mismo historial a través de `ChatContext`.

---

## 🖼️ Gestión de Imágenes

El componente `Modal_imagenes.jsx` permite a admins y hosts gestionar las fotos de cada propiedad:

- **Drag & drop** o selección múltiple de archivos
- Límite de **5MB** por imagen
- Marcar cualquier imagen como **principal**
- Eliminar imágenes (se borra también de Cloudinary en el backend)

---

## 🏗️ Convenciones del Proyecto

- Los **custom hooks** (`use*.js`) encapsulan toda la lógica de fetch + estado de carga + error, y exponen un método `refetch` para recargar los datos.
- Los **servicios** (`*_service.js`) son simples wrappers de Axios, sin lógica de estado.
- Los **modales** de CRUD reciben `show`, `modo` (`"crear"` | `"editar"`), el objeto seleccionado, `handleClose` y `onSuccess` (callback que llama al `refetch` del hook).
- El diseño de las páginas públicas y de usuario usa **CSS-in-JS inline** con un sistema de colores consistente basado en azul (`#00b4e6`, `#0090c8`, `#002d44`).

---

