import { Link, NavLink, useNavigate } from 'react-router-dom'
import { queryClient } from '../api/queryClient'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'

const estiloLink = ({ isActive }: { isActive: boolean }) =>
  `text-sm hover:text-orange-600 ${isActive ? 'text-orange-600 font-semibold' : 'text-gray-700'}`

export function Navbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const cantidadEnCarrito = useCartStore((s) => s.items.reduce((suma, i) => suma + i.cantidad, 0))
  const navigate = useNavigate()

  const cerrarSesion = async () => {
    await logout()
    // Borra los datos en caché del usuario anterior (pedidos, etc.)
    queryClient.clear()
    navigate('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link to="/" className="text-xl font-bold text-orange-500">
          Food Store
        </Link>

        <NavLink to="/" end className={estiloLink}>
          Catálogo
        </NavLink>
        <NavLink to="/carrito" className={estiloLink}>
          Carrito ({cantidadEnCarrito})
        </NavLink>
        {usuario && (
          <NavLink to="/mis-pedidos" className={estiloLink}>
            Mis pedidos
          </NavLink>
        )}

        {usuario?.role === 'admin' && (
          <div className="flex flex-wrap gap-x-4 border-l pl-4">
            <NavLink to="/admin/resumen" className={estiloLink}>
              Resumen
            </NavLink>
            <NavLink to="/admin/categorias" className={estiloLink}>
              Categorías
            </NavLink>
            <NavLink to="/admin/productos" className={estiloLink}>
              Productos
            </NavLink>
            <NavLink to="/admin/pedidos" className={estiloLink}>
              Pedidos
            </NavLink>
            <NavLink to="/admin/usuarios" className={estiloLink}>
              Usuarios
            </NavLink>
          </div>
        )}

        <div className="ml-auto flex items-center gap-4">
          {usuario ? (
            <>
              <span className="text-sm text-gray-600">
                {usuario.full_name} <span className="text-gray-400">({usuario.role})</span>
              </span>
              <button onClick={cerrarSesion} className="text-sm text-red-600 hover:underline">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={estiloLink}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={estiloLink}>
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
