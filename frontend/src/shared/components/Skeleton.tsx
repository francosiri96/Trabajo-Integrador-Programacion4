interface SkeletonProps {
  className?: string
}

/** Bloque gris animado que se muestra mientras cargan los datos. */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
}
