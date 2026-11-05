import axiosInstance from '../../../shared/api/axiosInstance'
import type {
  FiltrosProductos,
  Producto,
  ProductoForm,
  ProductosPaginados,
  ProductoStockUpdate,
} from '../types/producto'

export async function getProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const response = await axiosInstance.get<ProductosPaginados>('/productos', { params: filtros })
  return response.data
}

export async function crearProducto(data: ProductoForm): Promise<Producto> {
  const response = await axiosInstance.post<Producto>('/productos', data)
  return response.data
}

export async function actualizarProducto(id: number, data: ProductoForm): Promise<Producto> {
  const response = await axiosInstance.put<Producto>(`/productos/${id}`, data)
  return response.data
}

export async function actualizarStock(id: number, data: ProductoStockUpdate): Promise<Producto> {
  const response = await axiosInstance.patch<Producto>(`/productos/${id}/stock`, data)
  return response.data
}

export async function eliminarProducto(id: number): Promise<void> {
  await axiosInstance.delete(`/productos/${id}`)
}
