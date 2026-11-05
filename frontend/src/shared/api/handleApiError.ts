import axios from 'axios'

interface ErrorDeValidacion {
  msg: string
}

/** Convierte el error de la API en un texto para mostrar en pantalla. */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor'
    }

    const detail: unknown = error.response.data?.detail
    if (typeof detail === 'string') {
      return detail
    }
    // Los errores 422 de FastAPI vienen como una lista
    if (Array.isArray(detail)) {
      return detail.map((e: ErrorDeValidacion) => e.msg).join('. ')
    }
  }
  return 'Ocurrió un error inesperado'
}
