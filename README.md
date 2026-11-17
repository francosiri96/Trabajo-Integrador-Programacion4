# Food Store

Trabajo Práctico Integrador de Programación 4 (UTN - TUPaD).

Aplicación web para un negocio de comidas: los clientes se registran, recorren el catálogo, arman el carrito y confirman pedidos; el administrador gestiona categorías, productos, stock, pedidos y usuarios.

- **Repositorio:** https://github.com/francosiri96/Trabajo-Integrador-Programacion4
- **Video de demostración:** COMPLETAR_LINK_DEL_VIDEO

## Tecnologías

- **Backend:** Python, FastAPI, SQLModel, PostgreSQL (o SQLite para desarrollo), JWT en cookie HttpOnly.
- **Frontend:** React + TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form, TanStack Table, Zustand, Axios, React Router.

## Requisitos

- Python 3.11 a 3.13 (no usar 3.14)
- PostgreSQL 15 o superior (opcional: se puede usar SQLite)
- Node.js 20.19 o superior
- pnpm 9 o superior (`npm install -g pnpm`)

## Backend

Desde la carpeta `backend/`:

1. Crear y activar el entorno virtual:

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux / macOS
   source venv/bin/activate
   ```

2. Instalar las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

3. Copiar `.env.example` a `.env` y completar los valores (ver la tabla de variables más abajo).
   Si se usa PostgreSQL, la base `foodstore_db` tiene que estar creada antes de seguir.

4. Cargar los datos iniciales (crea las tablas, el usuario admin, categorías y productos). Se puede correr más de una vez sin duplicar datos:

   ```bash
   python -m app.db.seed
   ```

5. Levantar el servidor:

   ```bash
   uvicorn app.main:app --reload
   ```

La API queda en `http://localhost:8000/api/v1` y la documentación en:

- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Variables de entorno del backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a la base de datos | `postgresql://postgres:postgres@localhost:5432/foodstore_db` (o `sqlite:///./foodstore.db`) |
| `SECRET_KEY` | Clave para firmar el JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión en minutos | `30` |
| `FRONTEND_ORIGIN` | Origen del frontend permitido por CORS | `http://localhost:5173` |

## Frontend

Desde la carpeta `frontend/`:

1. Copiar `.env.example` a `.env`.
2. Instalar las dependencias:

   ```bash
   pnpm install
   ```

3. Compilar (verifica los tipos) y levantar el servidor de desarrollo:

   ```bash
   pnpm build
   pnpm dev
   ```

La aplicación queda en http://localhost:5173. El backend tiene que estar corriendo.

### Variables de entorno del frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

## Usuario administrador (seed)

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

Para probar como cliente, registrar un usuario nuevo desde `/register`.

## Funcionalidades

**Cliente**
- Registro e inicio de sesión.
- Catálogo con búsqueda, filtro por categoría y paginación.
- Carrito que se mantiene al recargar la página.
- Checkout con dirección de entrega, forma de pago (efectivo o transferencia) y notas.
- Mis pedidos: listado, detalle y cancelación mientras el pedido está PENDIENTE.

**Administrador** (menú del panel en la barra superior)
- Resumen con indicadores de pedidos e ingresos.
- ABM de categorías y productos, con cambio de stock y disponibilidad.
- Gestión de pedidos: PENDIENTE → EN_PREPARACION → ENTREGADO, o cancelar (devuelve el stock).
- Gestión de usuarios: activar y desactivar.

## Estructura

```
backend/
  app/
    core/       configuración, base de datos, seguridad, dependencias, UnitOfWork y BaseRepository
    modules/    auth, usuarios, categorias, productos, pedidos
    db/seed.py  datos iniciales
frontend/
  src/
    features/   auth, categorias, productos, pedidos, usuarios
    shared/     api, ui, components, layout
    store/      authStore y cartStore
    routes/     AppRouter y ProtectedRoute
```
