interface EstadoErrorProps {
  mensaje: string
}

export function EstadoError({ mensaje }: EstadoErrorProps) {
  return <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 my-4">{mensaje}</div>
}
