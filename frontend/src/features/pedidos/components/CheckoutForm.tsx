import { useForm } from '@tanstack/react-form'
import { Button } from '../../../shared/ui/Button'
import { Input } from '../../../shared/ui/Input'
import type { FormaPago } from '../types/pedido'

export interface DatosCheckout {
  direccion_entrega: string
  forma_pago: FormaPago
  notas: string
}

interface CheckoutFormProps {
  onConfirmar: (datos: DatosCheckout) => Promise<void>
}

export function CheckoutForm({ onConfirmar }: CheckoutFormProps) {
  const form = useForm({
    defaultValues: { direccion_entrega: '', forma_pago: 'EFECTIVO', notas: '' } as DatosCheckout,
    onSubmit: async ({ value }) => {
      await onConfirmar(value)
    },
  })

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) => {
            const largo = value.trim().length
            if (largo < 5) return 'La dirección debe tener al menos 5 caracteres'
            if (largo > 200) return 'La dirección no puede superar los 200 caracteres'
            return undefined
          },
        }}
      >
        {(field) => (
          <Input
            id="direccion_entrega"
            label="Dirección de entrega"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors[0]}
          />
        )}
      </form.Field>

      <form.Field name="forma_pago">
        {(field) => (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Forma de pago</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={field.state.value === 'EFECTIVO'}
                  onChange={() => field.handleChange('EFECTIVO')}
                />
                Efectivo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={field.state.value === 'TRANSFERENCIA'}
                  onChange={() => field.handleChange('TRANSFERENCIA')}
                />
                Transferencia
              </label>
            </div>
          </div>
        )}
      </form.Field>

      <form.Field name="notas">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="notas" className="text-sm font-medium text-gray-700">
              Notas (opcional)
            </label>
            <textarea
              id="notas"
              rows={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(enviando) => (
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Enviando pedido...' : 'Confirmar pedido'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
