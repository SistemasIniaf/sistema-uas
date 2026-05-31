import axios from "axios"
import { useAuthStore } from "@/store/auth.store"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

// ── Request interceptor ───────────────────────────────────────────────────────
// Adjunta el token JWT en cada request automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ── Response interceptor ─────────────────────────────────────────────────────
// Si el servidor responde 401, limpia la sesión y redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login")

    if (error.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout()
      window.location.href = "/auth/login"
    }

    return Promise.reject(error)
  }
)
