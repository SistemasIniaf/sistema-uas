import axios from "axios"
import { useAuthStore } from "@/store/auth.store"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // Por defecto axios omite `false` en los query params.
  // Este serializer lo incluye explícitamente para que el backend
  // distinga entre "sin filtro" (undefined) e "inactivos" (false).
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
    return searchParams.toString()
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
