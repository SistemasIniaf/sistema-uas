import { z } from "zod"

export const unidadSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),

  sigla: z
    .string()
    .min(1, "La sigla es requerida")
    .min(2, "La sigla debe tener al menos 2 caracteres")
    .max(10, "La sigla no puede superar los 10 caracteres"),

  activo: z.boolean().default(true),
})

export const updateUnidadSchema = unidadSchema.partial()

export type UnidadFormInput = z.input<typeof unidadSchema>
export type UnidadFormOutput = z.infer<typeof unidadSchema>
export type UpdateUnidadFormInput = z.input<typeof updateUnidadSchema>
