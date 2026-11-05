import axiosInstance from '../../../shared/api/axiosInstance'
import type { Usuario } from '../../usuarios/types/usuario'
import type { RegistroData } from '../types/auth'

export async function login(username: string, password: string): Promise<void> {
  // El endpoint espera un formulario OAuth2, no JSON
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  await axiosInstance.post('/auth/token', form)
}

export async function registrar(data: RegistroData): Promise<Usuario> {
  const response = await axiosInstance.post<Usuario>('/auth/register', data)
  return response.data
}

export async function logout(): Promise<void> {
  await axiosInstance.post('/auth/logout')
}

export async function getMe(): Promise<Usuario> {
  const response = await axiosInstance.get<Usuario>('/auth/me')
  return response.data
}
