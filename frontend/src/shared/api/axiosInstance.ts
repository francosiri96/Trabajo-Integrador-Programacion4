import axios from 'axios'
import { useAuthStore } from '../../store/authStore'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Hace que el navegador mande la cookie de sesión en cada pedido
  withCredentials: true,
})

// En estas rutas un 401 es normal (login fallido o no hay sesión todavía)
const RUTAS_DE_SESION = ['/auth/token', '/auth/me']

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status
      const url = error.config?.url ?? ''
      const data = error.response.data as { detail?: unknown }
      const esRutaDeSesion = RUTAS_DE_SESION.some((ruta) => url.includes(ruta))

      // Sesión vencida o cuenta desactivada: se borra el usuario y
      // ProtectedRoute lo manda al login
      if (status === 401 && !esRutaDeSesion) {
        useAuthStore.getState().limpiarSesion()
      }
      if (status === 400 && data.detail === 'Cuenta de usuario desactivada') {
        useAuthStore.getState().limpiarSesion()
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
