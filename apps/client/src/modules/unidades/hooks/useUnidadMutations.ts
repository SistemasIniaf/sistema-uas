import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import { unidadService } from "../services/unidad.service"
import { unidadesKeys } from "./useUnidades"
import type {
  CreateUnidadPayload,
  UpdateUnidadPayload,
} from "../types/unidad.types"

// ── Helper ────────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message
    return Array.isArray(msg) ? msg.join(", ") : (msg ?? fallback)
  }
  return fallback
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreateUnidad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUnidadPayload) => unidadService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unidadesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: unidadesKeys.allNoPaginated() })
      toast.success("Unidad creada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear la unidad"))
    },
  })
}

export function useUpdateUnidad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateUnidadPayload
    }) => unidadService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: unidadesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: unidadesKeys.allNoPaginated() })
      queryClient.invalidateQueries({ queryKey: unidadesKeys.detail(id) })
      toast.success("Unidad actualizada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar la unidad"))
    },
  })
}

export function useToggleUnidad() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => unidadService.toggleActivo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: unidadesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: unidadesKeys.allNoPaginated() })
      toast.success(
        data.activo
          ? "Unidad activada correctamente"
          : "Unidad desactivada correctamente"
      )
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al cambiar el estado"))
    },
  })
}

export function useDeleteUnidad() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => unidadService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unidadesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: unidadesKeys.allNoPaginated() })
      toast.success("Unidad eliminada correctamente")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar la unidad"))
    },
  })
}
