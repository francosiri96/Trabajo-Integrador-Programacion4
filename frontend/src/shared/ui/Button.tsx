import type { ButtonHTMLAttributes } from 'react'

type Variante = 'primario' | 'secundario' | 'peligro'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
}

const estilos: Record<Variante, string> = {
  primario: 'bg-orange-500 text-white hover:bg-orange-600',
  secundario: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
  peligro: 'bg-red-500 text-white hover:bg-red-600',
}

export function Button({ variante = 'primario', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
      {...props}
    />
  )
}
