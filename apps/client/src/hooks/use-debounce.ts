import { useEffect, useState } from "react"

/**
 * Retrasa la actualización de un valor hasta que el usuario deje de escribir.
 * Ideal para disparar búsquedas al servidor sin saturar la API.
 *
 * @param value  Valor a "debouncear"
 * @param delay  Tiempo de espera en ms (por defecto 400)
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
