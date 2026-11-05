import type { ReactNode } from 'react'

interface ModalProps {
  titulo: string
  abierto: boolean
  onCerrar: () => void
  children: ReactNode
}

export function Modal({ titulo, abierto, onCerrar, children }: ModalProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={onCerrar}>
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        // Evita que un click adentro del modal lo cierre
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="font-semibold text-lg">{titulo}</h2>
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-800 text-xl leading-none">
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
