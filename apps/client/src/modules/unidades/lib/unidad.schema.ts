import { z } from "zod"

export const unidadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(150, "El nombre no puede superar los 150 caracteres"),

  descripcion: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional()
    .or(z.literal("")),

  activo: z.boolean().default(true),
})

export const updateUnidadSchema = unidadSchema.partial()

export type UnidadFormInput = z.input<typeof unidadSchema>
export type UnidadFormOutput = z.infer<typeof unidadSchema>
export type UpdateUnidadFormInput = z.input<typeof updateUnidadSchema>
