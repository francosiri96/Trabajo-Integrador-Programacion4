import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { Rol } from '../features/usuarios/types/usuario'

interface ProtectedRouteProps {
  roles?: Rol[] // si no se pasa, alcanza con tener sesión
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const usuario = useAuthStore((s) => s.usuario)
  const cargando = useAuthStore((s) => s.cargando)

  // Mientras checkSession confirma la cookie no se redirige
  if (cargando) {
    return <p className="text-center text-gray-500 py-12">Verificando sesión...</p>
  }

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(usuario.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
