import { Card } from '../../../shared/ui/Card'

interface TarjetaResumenProps {
  titulo: string
  valor: string | number
  color?: string
}

export function TarjetaResumen({ titulo, valor, color = 'text-gray-900' }: TarjetaResumenProps) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{titulo}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{valor}</p>
    </Card>
  )
}
