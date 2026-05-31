import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
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
      sigla: "",
      activo: true,
    },
  })

  // Cuando se abre en modo edición, rellena el formulario con los datos actuales
  useEffect(() => {
    if (unidad) {
      reset({
        nombre: unidad.nombre,
        sigla: unidad.sigla,
        activo: unidad.activo,
      })
    } else {
      reset({ nombre: "", sigla: "", activo: true })
    }
  }, [unidad, reset])

  function onSubmit(data: UnidadFormInput) {
    if (isEditing) {
      update({ id: unidad.id, payload: data })
    } else {
      create(data)
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
        <FormInput
          name="sigla"
          label="Sigla"
          placeholder="Ej: DSI"
          control={control}
          disabled={isPending}
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
