import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
import { FormTextarea } from "@/components/form/FormTextarea"
import { FormCheckbox } from "@/components/form/FormCheckbox"
import { FieldGroup } from "@/components/ui/field"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"

import { unidadSchema } from "../lib/unidad.schema"
import { useCreateUnidad, useUpdateUnidad } from "../hooks/useUnidadMutations"

import type { UnidadFormInput } from "../lib/unidad.schema"
import type { Unidad } from "../types/unidad.types"

interface UnidadFormProps {
  /** Si se pasa una unidad, el formulario entra en modo edición. */
  unidad?: Unidad
  onClose?: () => void
}

export function UnidadForm({ unidad, onClose }: UnidadFormProps) {
  const isEditing = !!unidad

  const { mutate: create, isPending: isCreating } = useCreateUnidad({
    onSuccess: onClose,
  })
  const { mutate: update, isPending: isUpdating } = useUpdateUnidad({
    onSuccess: onClose,
  })

  const isPending = isCreating || isUpdating

  const { control, handleSubmit, reset } = useForm<UnidadFormInput>({
    resolver: zodResolver(unidadSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      activo: true,
    },
  })

  useEffect(() => {
    if (unidad) {
      reset({
        nombre: unidad.nombre,
        descripcion: unidad.descripcion ?? "",
        activo: unidad.activo,
      })
    } else {
      reset({ nombre: "", descripcion: "", activo: true })
    }
  }, [unidad, reset])

  function onSubmit(data: UnidadFormInput) {
    const payload = {
      nombre: data.nombre,
      descripcion: data.descripcion || undefined,
      activo: data.activo,
    }

    if (isEditing) {
      update({ id: unidad.id, payload })
    } else {
      create(payload)
    }
  }

  function handleCancel() {
    reset()
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre"
          placeholder="Ej: Dirección de Sistemas"
          control={control}
          disabled={isPending}
        />
        <FormTextarea
          name="descripcion"
          label="Descripción"
          placeholder="Descripción opcional de la unidad..."
          control={control}
          disabled={isPending}
          required={false}
          rows={3}
        />
        {isEditing && (
          <FormCheckbox
            name="activo"
            label="Unidad activa"
            control={control}
            disabled={isPending}
            required={false}
          />
        )}
      </FieldGroup>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Guardando..."
              : "Registrando..."
            : isEditing
              ? "Guardar cambios"
              : "Registrar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
