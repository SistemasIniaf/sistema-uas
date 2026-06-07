import { z } from "zod"

// ── Producto ──────────────────────────────────────────────────────────────────

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  activo: z.boolean().default(true),
})

export const updateProductoSchema = productoSchema.partial()

export type ProductoFormInput = z.input<typeof productoSchema>
export type UpdateProductoFormInput = z.input<typeof updateProductoSchema>

// ── Variedad ──────────────────────────────────────────────────────────────────

export const variedadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  productoId: z.coerce
    .number({ error: () => ({ message: "Selecciona un producto" }) })
    .int()
    .positive("Selecciona un producto válido"),
  activo: z.boolean().default(true),
})

export const updateVariedadSchema = variedadSchema.partial()

export type VariedadFormInput = z.input<typeof variedadSchema>
export type UpdateVariedadFormInput = z.input<typeof updateVariedadSchema>

// ── Categoria ─────────────────────────────────────────────────────────────────

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  activo: z.boolean().default(true),
})

export const updateCategoriaSchema = categoriaSchema.partial()

export type CategoriaFormInput = z.input<typeof categoriaSchema>
export type UpdateCategoriaFormInput = z.input<typeof updateCategoriaSchema>
