import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-2xl font-bold mb-2">Sin permiso</h1>
      <p className="text-gray-600 mb-6">No tenés permiso para ver esta página.</p>
      <Link to="/" className="text-orange-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  )
}
