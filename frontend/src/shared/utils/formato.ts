export function formatearPrecio(valor: number): string {
  return valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
}

export function formatearFecha(fecha: string): string {
  return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}
