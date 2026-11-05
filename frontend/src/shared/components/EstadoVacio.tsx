import type { ReactNode } from 'react'

interface EstadoVacioProps {
  mensaje: string
  children?: ReactNode
}

export function EstadoVacio({ mensaje, children }: EstadoVacioProps) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="mb-4">{mensaje}</p>
      {children}
    </div>
  )
}
