import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth.service"
import { useAuthStore } from "@/store/auth.store"

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useLogin(options?: UseLoginOptions) {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ accessToken, usuario }) => {
      login(accessToken, usuario)
      options?.onSuccess?.()
      navigate("/")
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}
