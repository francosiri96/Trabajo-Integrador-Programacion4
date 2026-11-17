import axiosInstance from '../../../shared/api/axiosInstance'
import type { Usuario } from '../types/usuario'

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await axiosInstance.get<Usuario[]>('/admin/usuarios')
  return response.data
}

export async function activarUsuario(id: number): Promise<Usuario> {
  const response = await axiosInstance.post<Usuario>(`/admin/usuarios/${id}/activar`)
  return response.data
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
  const response = await axiosInstance.post<Usuario>(`/admin/usuarios/${id}/desactivar`)
  return response.data
}
