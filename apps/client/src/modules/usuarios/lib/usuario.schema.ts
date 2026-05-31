import { z } from "zod"
import { ROL_ENUM } from "../types/usuario.types"

// ── Crear ─────────────────────────────────────────────────────────────────────

export const createUsuarioSchema = z
  .object({
    nombre: z
      .string()
      .min(1, "El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede superar los 100 caracteres"),

    usuario: z
      .string()
      .min(1, "El usuario es requerido")
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(50, "El usuario no puede superar los 50 caracteres")
      .regex(/^[a-zA-Z0-9_.]+$/, "Solo letras, números, punto y guión bajo"),

    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100, "La contraseña no puede superar los 100 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),

    rol: z.enum(ROL_ENUM, {
      error: () => ({ message: "Selecciona un rol válido" }),
    }),

    /**
     * unidadId es requerido para todos los roles excepto administrador.
     * La validación cruzada se hace con .check() (Zod v4).
     * El valor llega como string desde el <Select>, z.coerce.number() lo convierte.
     */
    unidadId: z.coerce.number().int().positive().optional(),

    activo: z.boolean().default(true),
  })
  .check((ctx) => {
    const { rol, unidadId } = ctx.value
    if (rol !== "administrador" && !unidadId) {
      ctx.issues.push({
        code: "custom",
        path: ["unidadId"],
        message: "La unidad es requerida para este rol",
        input: unidadId,
      })
    }
    if (rol === "administrador" && unidadId) {
      ctx.issues.push({
        code: "custom",
        path: ["unidadId"],
        message: "El administrador no puede tener unidad asignada",
        input: unidadId,
      })
    }
  })

// ── Editar ────────────────────────────────────────────────────────────────────

export const updateUsuarioSchema = z
  .object({
    nombre: z
      .string()
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(100, "El nombre no puede superar los 100 caracteres")
      .optional(),

    usuario: z
      .string()
      .min(3, "El usuario debe tener al menos 3 caracteres")
      .max(50, "El usuario no puede superar los 50 caracteres")
      .regex(/^[a-zA-Z0-9_.]+$/, "Solo letras, números, punto y guión bajo")
      .optional(),

    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .max(100)
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .optional()
      .or(z.literal("")),

    rol: z.enum(ROL_ENUM).optional(),

    unidadId: z.coerce.number().int().positive().optional().nullable(),

    activo: z.boolean().optional(),
  })
  .check((ctx) => {
    const { rol, unidadId } = ctx.value
    if (!rol) return
    if (rol !== "administrador" && unidadId === null) {
      ctx.issues.push({
        code: "custom",
        path: ["unidadId"],
        message: "La unidad es requerida para este rol",
        input: unidadId,
      })
    }
  })

export type CreateUsuarioFormInput = z.input<typeof createUsuarioSchema>
export type CreateUsuarioFormOutput = z.infer<typeof createUsuarioSchema>
export type UpdateUsuarioFormInput = z.input<typeof updateUsuarioSchema>
export type UpdateUsuarioFormOutput = z.infer<typeof updateUsuarioSchema>
