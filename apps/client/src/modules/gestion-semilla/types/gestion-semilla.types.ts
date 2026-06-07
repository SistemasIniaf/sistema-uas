// ── Producto ──────────────────────────────────────────────────────────────────

export interface Producto {
  id: number
  nombre: string
  activo: boolean
  _count: { variedades: number }
}

export interface ProductoDetalle extends Omit<Producto, "_count"> {
  variedades: {
    id: number
    nombre: string
    activo: boolean
  }[]
  createdAt: string
  updatedAt: string
}

// ── Variedad ──────────────────────────────────────────────────────────────────

export interface Variedad {
  id: number
  nombre: string
  activo: boolean
  productoId: number
  producto: { id: number; nombre: string }
}

// ── Categoria ─────────────────────────────────────────────────────────────────

export interface Categoria {
  id: number
  nombre: string
  activo: boolean
}

// ── Paginación ────────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    lastPage: number
  }
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface ProductosQueryParams {
  page?: number
  limit?: number
  search?: string
  activo?: boolean
}

export interface VariedadesQueryParams {
  page?: number
  limit?: number
  search?: string
  productoId?: number
  activo?: boolean
}

export interface CategoriasQueryParams {
  page?: number
  limit?: number
  search?: string
  activo?: boolean
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateProductoPayload {
  nombre: string
  activo?: boolean
}
export type UpdateProductoPayload = Partial<CreateProductoPayload>

export interface CreateVariedadPayload {
  nombre: string
  productoId: number
  activo?: boolean
}
export type UpdateVariedadPayload = Partial<CreateVariedadPayload>

export interface CreateCategoriaPayload {
  nombre: string
  activo?: boolean
}
export type UpdateCategoriaPayload = Partial<CreateCategoriaPayload>
