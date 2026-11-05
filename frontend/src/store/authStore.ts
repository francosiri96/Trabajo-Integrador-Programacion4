import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMe, login as loginApi, logout as logoutApi } from '../features/auth/api/auth'
import type { Usuario } from '../features/usuarios/types/usuario'

interface AuthState {
  usuario: Usuario | null
  cargando: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
  limpiarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await loginApi(username, password)
        const usuario = await getMe()
        set({ usuario })
      },

      logout: async () => {
        try {
          await logoutApi()
        } finally {
          set({ usuario: null })
        }
      },

      // Se llama al abrir la app para ver si la cookie sigue siendo válida
      checkSession: async () => {
        set({ cargando: true })
        try {
          const usuario = await getMe()
          set({ usuario })
        } catch {
          set({ usuario: null })
        } finally {
          set({ cargando: false })
        }
      },

      limpiarSesion: () => set({ usuario: null }),
    }),
    {
      name: 'foodstore-auth',
      // Solo se guarda el usuario. El token nunca pasa por acá: vive en la cookie
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
)
