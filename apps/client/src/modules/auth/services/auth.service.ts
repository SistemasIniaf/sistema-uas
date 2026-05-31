import { api } from "@/lib/axios"
import type { AuthUsuario } from "@/store/auth.store"

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  usuario: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  usuario: AuthUsuario
}

// ── Servicios ─────────────────────────────────────────────────────────────────

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload)
    return data
  },

  me: async (): Promise<AuthUsuario> => {
    const { data } = await api.get<AuthUsuario>("/auth/me")
    return data
  },
}
