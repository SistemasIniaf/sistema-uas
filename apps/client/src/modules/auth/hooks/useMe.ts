import { useQuery } from "@tanstack/react-query"
import { authService } from "../services/auth.service"
import { useAuthStore, useIsAuthenticated } from "@/store/auth.store"

export function useMe() {
  const isAuthenticated = useIsAuthenticated()
  const setUser = useAuthStore((s) => s.setUser)

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const user = await authService.me()
      setUser(user)
      return user
    },
    // Solo ejecuta si hay sesión activa
    enabled: isAuthenticated,
    // No reintentar si falla (el interceptor de axios ya maneja el 401)
    retry: false,
    // Revalidar cuando la ventana recupera el foco
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
