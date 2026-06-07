import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { isAxiosError } from "axios"
import {
  productoService,
  variedadService,
  categoriaService,
} from "../services/gestion-semilla.service"
import {
  productosKeys,
  variedadesKeys,
  categoriasKeys,
} from "./useGestionSemilla"
import type {
  CreateProductoPayload,
  UpdateProductoPayload,
  CreateVariedadPayload,
  UpdateVariedadPayload,
  CreateCategoriaPayload,
  UpdateCategoriaPayload,
} from "../types/gestion-semilla.types"

// ── Helper ────────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const msg = error.response?.data?.message
    return Array.isArray(msg) ? msg.join(", ") : (msg ?? fallback)
  }
  return fallback
}

// ── Productos mutations ───────────────────────────────────────────────────────

export function useCreateProducto(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductoPayload) =>
      productoService.create(payload),
    onSuccess: () => {
      // productosKeys.all invalida listas, noPaginated(true) y noPaginated(false)
      queryClient.invalidateQueries({ queryKey: productosKeys.all })
      toast.success("Producto creado correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear el producto"))
    },
  })
}

export function useUpdateProducto(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateProductoPayload
    }) => productoService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all })
      queryClient.invalidateQueries({ queryKey: productosKeys.detail(id) })
      toast.success("Producto actualizado correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar el producto"))
    },
  })
}

export function useToggleProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productoService.toggleActivo(id),
    onSuccess: (data) => {
      // Invalida todo productos: listas paginadas, noPaginated(true) y noPaginated(false)
      queryClient.invalidateQueries({ queryKey: productosKeys.all })
      // Las variedades también se refrescan porque el estado del producto las afecta
      queryClient.invalidateQueries({ queryKey: variedadesKeys.lists() })
      toast.success(
        data.activo
          ? "Producto activado correctamente"
          : "Producto desactivado correctamente"
      )
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Error al cambiar el estado del producto")
      )
    },
  })
}

export function useDeleteProducto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productoService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.all })
      toast.success("Producto eliminado correctamente")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar el producto"))
    },
  })
}

// ── Variedades mutations ──────────────────────────────────────────────────────

export function useCreateVariedad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateVariedadPayload) =>
      variedadService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variedadesKeys.lists() })
      // Actualiza el _count.variedades del producto padre
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() })
      toast.success("Variedad creada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear la variedad"))
    },
  })
}

export function useUpdateVariedad(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateVariedadPayload
    }) => variedadService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: variedadesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: variedadesKeys.detail(id) })
      toast.success("Variedad actualizada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar la variedad"))
    },
  })
}

export function useToggleVariedad() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => variedadService.toggleActivo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: variedadesKeys.lists() })
      toast.success(
        data.activo
          ? "Variedad activada correctamente"
          : "Variedad desactivada correctamente"
      )
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Error al cambiar el estado de la variedad")
      )
    },
  })
}

export function useDeleteVariedad() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => variedadService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: variedadesKeys.lists() })
      // Actualiza el _count.variedades del producto padre
      queryClient.invalidateQueries({ queryKey: productosKeys.lists() })
      toast.success("Variedad eliminada correctamente")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar la variedad"))
    },
  })
}

// ── Categorias mutations ──────────────────────────────────────────────────────

export function useCreateCategoria(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoriaPayload) =>
      categoriaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.all })
      toast.success("Categoría creada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al crear la categoría"))
    },
  })
}

export function useUpdateCategoria(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCategoriaPayload
    }) => categoriaService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.all })
      queryClient.invalidateQueries({ queryKey: categoriasKeys.detail(id) })
      toast.success("Categoría actualizada correctamente")
      options?.onSuccess?.()
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al actualizar la categoría"))
    },
  })
}

export function useToggleCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriaService.toggleActivo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.all })
      toast.success(
        data.activo
          ? "Categoría activada correctamente"
          : "Categoría desactivada correctamente"
      )
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Error al cambiar el estado de la categoría")
      )
    },
  })
}

export function useDeleteCategoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriaService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriasKeys.all })
      toast.success("Categoría eliminada correctamente")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error al eliminar la categoría"))
    },
  })
}
