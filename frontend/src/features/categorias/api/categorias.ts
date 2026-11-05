import axiosInstance from '../../../shared/api/axiosInstance'
import type { Categoria, CategoriaForm } from '../types/categoria'

export async function getCategorias(): Promise<Categoria[]> {
  const response = await axiosInstance.get<Categoria[]>('/categorias')
  return response.data
}

export async function crearCategoria(data: CategoriaForm): Promise<Categoria> {
  const response = await axiosInstance.post<Categoria>('/categorias', data)
  return response.data
}

export async function actualizarCategoria(id: number, data: CategoriaForm): Promise<Categoria> {
  const response = await axiosInstance.put<Categoria>(`/categorias/${id}`, data)
  return response.data
}

export async function eliminarCategoria(id: number): Promise<void> {
  await axiosInstance.delete(`/categorias/${id}`)
}
