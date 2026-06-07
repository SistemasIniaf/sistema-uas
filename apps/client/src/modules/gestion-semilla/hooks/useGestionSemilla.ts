import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  productoService,
  variedadService,
  categoriaService,
} from "../services/gestion-semilla.service"
import type {
  ProductosQueryParams,
  VariedadesQueryParams,
  CategoriasQueryParams,
} from "../types/gestion-semilla.types"

// ── Query keys ────────────────────────────────────────────────────────────────

export const productosKeys = {
  all: ["productos"] as const,
  lists: () => [...productosKeys.all, "list"] as const,
  list: (params: ProductosQueryParams) =>
    [...productosKeys.lists(), params] as const,
  allNoPaginated: (activo?: boolean) =>
    [...productosKeys.all, "all", { activo }] as const,
  detail: (id: number) => [...productosKeys.all, id] as const,
}

export const variedadesKeys = {
  all: ["variedades"] as const,
  lists: () => [...variedadesKeys.all, "list"] as const,
  list: (params: VariedadesQueryParams) =>
    [...variedadesKeys.lists(), params] as const,
  allNoPaginated: (productoId?: number, activo?: boolean) =>
    [...variedadesKeys.all, "all", { productoId, activo }] as const,
  detail: (id: number) => [...variedadesKeys.all, id] as const,
}

export const categoriasKeys = {
  all: ["categorias"] as const,
  lists: () => [...categoriasKeys.all, "list"] as const,
  list: (params: CategoriasQueryParams) =>
    [...categoriasKeys.lists(), params] as const,
  allNoPaginated: (activo?: boolean) =>
    [...categoriasKeys.all, "all", { activo }] as const,
  detail: (id: number) => [...categoriasKeys.all, id] as const,
}

// ── Productos hooks ───────────────────────────────────────────────────────────

export function useProductos(params: ProductosQueryParams) {
  return useQuery({
    queryKey: productosKeys.list(params),
    queryFn: () => productoService.findAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useProductosAll(activo = true) {
  return useQuery({
    queryKey: productosKeys.allNoPaginated(activo),
    queryFn: () => productoService.findAllNoPaginated(activo),
    staleTime: 1000 * 60 * 10,
  })
}

export function useProducto(id: number) {
  return useQuery({
    queryKey: productosKeys.detail(id),
    queryFn: () => productoService.findOne(id),
    enabled: id > 0,
  })
}

// ── Variedades hooks ──────────────────────────────────────────────────────────

export function useVariedades(params: VariedadesQueryParams) {
  return useQuery({
    queryKey: variedadesKeys.list(params),
    queryFn: () => variedadService.findAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useVariedadesAll(productoId?: number, activo = true) {
  return useQuery({
    queryKey: variedadesKeys.allNoPaginated(productoId, activo),
    queryFn: () => variedadService.findAllNoPaginated(productoId, activo),
    staleTime: 1000 * 60 * 10,
  })
}

export function useVariedad(id: number) {
  return useQuery({
    queryKey: variedadesKeys.detail(id),
    queryFn: () => variedadService.findOne(id),
    enabled: id > 0,
  })
}

// ── Categorias hooks ──────────────────────────────────────────────────────────

export function useCategorias(params: CategoriasQueryParams) {
  return useQuery({
    queryKey: categoriasKeys.list(params),
    queryFn: () => categoriaService.findAll(params),
    placeholderData: keepPreviousData,
  })
}

export function useCategoriasAll(activo = true) {
  return useQuery({
    queryKey: categoriasKeys.allNoPaginated(activo),
    queryFn: () => categoriaService.findAllNoPaginated(activo),
    staleTime: 1000 * 60 * 10,
  })
}

export function useCategoria(id: number) {
  return useQuery({
    queryKey: categoriasKeys.detail(id),
    queryFn: () => categoriaService.findOne(id),
    enabled: id > 0,
  })
}
