import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrito {
  producto_id: number
  nombre: string
  precio_unitario: number
  cantidad: number
}

interface CartState {
  items: ItemCarrito[]
  agregar: (producto: Omit<ItemCarrito, 'cantidad'>) => void
  quitar: (producto_id: number) => void
  cambiarCantidad: (producto_id: number, cantidad: number) => void
  vaciar: () => void
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) => {
        const existente = get().items.find((i) => i.producto_id === producto.producto_id)
        if (existente) {
          // Si ya está en el carrito, se suma uno a la cantidad
          set({
            items: get().items.map((i) =>
              i.producto_id === producto.producto_id ? { ...i, cantidad: i.cantidad + 1 } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { ...producto, cantidad: 1 }] })
        }
      },

      quitar: (producto_id) => {
        set({ items: get().items.filter((i) => i.producto_id !== producto_id) })
      },

      cambiarCantidad: (producto_id, cantidad) => {
        if (cantidad < 1) return
        set({
          items: get().items.map((i) => (i.producto_id === producto_id ? { ...i, cantidad } : i)),
        })
      },

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0),
    }),
    { name: 'foodstore-carrito' },
  ),
)
