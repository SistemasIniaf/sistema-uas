import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { usuarioService } from "../services/usuario.service"
import { usuariosKeys } from "./useUsuarios"
import type {
  CreateUsuarioPayload,
  UpdateUsuarioPayload,
} from "../types/usuario.types"

// ── Helper ────────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message
    return Array.isArray(msg) ? msg.join(", ") : (msg ?? fallback)
  }
  return fallback
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUsuarioPayload) =>
      usuarioService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.allNoPaginated() })
      toast.success("Usuario creado correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear el usuario"))
    },
  })
}

export function useUpdateUsuario(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateUsuarioPayload
    }) => usuarioService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.allNoPaginated() })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.detail(id) })
      toast.success("Usuario actualizado correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar el usuario"))
    },
  })
}

export function useToggleUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usuarioService.toggleActivo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.allNoPaginated() })
      toast.success(
        data.activo
          ? "Usuario activado correctamente"
          : "Usuario desactivado correctamente"
      )
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al cambiar el estado"))
    },
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => usuarioService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usuariosKeys.lists() })
      queryClient.invalidateQueries({ queryKey: usuariosKeys.allNoPaginated() })
      toast.success("Usuario eliminado correctamente")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar el usuario"))
    },
  })
}
