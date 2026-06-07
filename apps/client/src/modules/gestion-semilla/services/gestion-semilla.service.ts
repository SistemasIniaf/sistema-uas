import { api } from "@/lib/axios"
import type {
  Producto,
  ProductoDetalle,
  ProductosQueryParams,
  Variedad,
  VariedadesQueryParams,
  Categoria,
  CategoriasQueryParams,
  PaginatedResult,
  CreateProductoPayload,
  UpdateProductoPayload,
  CreateVariedadPayload,
  UpdateVariedadPayload,
  CreateCategoriaPayload,
  UpdateCategoriaPayload,
} from "../types/gestion-semilla.types"

// ── Productos ─────────────────────────────────────────────────────────────────

export const productoService = {
  findAll: async (
    params: ProductosQueryParams
  ): Promise<PaginatedResult<Producto>> => {
    const { data } = await api.get<PaginatedResult<Producto>>("/productos", {
      params,
    })
    return data
  },

  findAllNoPaginated: async (activo = true): Promise<Producto[]> => {
    const { data } = await api.get<Producto[]>("/productos/all", {
      params: { activo },
    })
    return data
  },

  findOne: async (id: number): Promise<ProductoDetalle> => {
    const { data } = await api.get<ProductoDetalle>(`/productos/${id}`)
    return data
  },

  create: async (payload: CreateProductoPayload): Promise<Producto> => {
    const { data } = await api.post<Producto>("/productos", payload)
    return data
  },

  update: async (
    id: number,
    payload: UpdateProductoPayload
  ): Promise<Producto> => {
    const { data } = await api.patch<Producto>(`/productos/${id}`, payload)
    return data
  },

  toggleActivo: async (
    id: number
  ): Promise<Pick<Producto, "id" | "nombre" | "activo">> => {
    const { data } = await api.patch(`/productos/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`)
  },
}

// ── Variedades ────────────────────────────────────────────────────────────────

export const variedadService = {
  findAll: async (
    params: VariedadesQueryParams
  ): Promise<PaginatedResult<Variedad>> => {
    const { data } = await api.get<PaginatedResult<Variedad>>("/variedades", {
      params,
    })
    return data
  },

  findAllNoPaginated: async (
    productoId?: number,
    activo = true
  ): Promise<Variedad[]> => {
    const { data } = await api.get<Variedad[]>("/variedades/all", {
      params: { productoId, activo },
    })
    return data
  },

  findOne: async (id: number): Promise<Variedad> => {
    const { data } = await api.get<Variedad>(`/variedades/${id}`)
    return data
  },

  create: async (payload: CreateVariedadPayload): Promise<Variedad> => {
    const { data } = await api.post<Variedad>("/variedades", payload)
    return data
  },

  update: async (
    id: number,
    payload: UpdateVariedadPayload
  ): Promise<Variedad> => {
    const { data } = await api.patch<Variedad>(`/variedades/${id}`, payload)
    return data
  },

  toggleActivo: async (
    id: number
  ): Promise<Pick<Variedad, "id" | "nombre" | "activo" | "productoId">> => {
    const { data } = await api.patch(`/variedades/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/variedades/${id}`)
  },
}

// ── Categorias ────────────────────────────────────────────────────────────────

export const categoriaService = {
  findAll: async (
    params: CategoriasQueryParams
  ): Promise<PaginatedResult<Categoria>> => {
    const { data } = await api.get<PaginatedResult<Categoria>>("/categorias", {
      params,
    })
    return data
  },

  findAllNoPaginated: async (activo = true): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>("/categorias/all", {
      params: { activo },
    })
    return data
  },

  findOne: async (id: number): Promise<Categoria> => {
    const { data } = await api.get<Categoria>(`/categorias/${id}`)
    return data
  },

  create: async (payload: CreateCategoriaPayload): Promise<Categoria> => {
    const { data } = await api.post<Categoria>("/categorias", payload)
    return data
  },

  update: async (
    id: number,
    payload: UpdateCategoriaPayload
  ): Promise<Categoria> => {
    const { data } = await api.patch<Categoria>(`/categorias/${id}`, payload)
    return data
  },

  toggleActivo: async (
    id: number
  ): Promise<Pick<Categoria, "id" | "nombre" | "activo">> => {
    const { data } = await api.patch(`/categorias/${id}/toggle`)
    return data
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`)
  },
}
