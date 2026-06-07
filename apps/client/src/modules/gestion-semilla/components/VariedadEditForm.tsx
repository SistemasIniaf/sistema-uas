import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FormCheckbox } from "@/components/form/FormCheckbox"
import { FieldGroup } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"

import { variedadSchema } from "../lib/gestion-semilla.schemas"
import { useUpdateVariedad } from "../hooks/useGestionSemillaMutations"
import { useProductosAll } from "../hooks/useGestionSemilla"
import type { VariedadFormInput } from "../lib/gestion-semilla.schemas"
import type { Variedad } from "../types/gestion-semilla.types"

interface Props {
  variedad: Variedad
  onClose: () => void
}

export function VariedadEditForm({ variedad, onClose }: Props) {
  // Todos los productos (activos + inactivos) para que el asignado
  // siempre aparezca en el select aunque esté inactivo
  const { data: productos = [], isLoading } = useProductosAll(false)
  const { mutate: update, isPending } = useUpdateVariedad({
    onSuccess: onClose,
  })

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  const productoAsignadoInactivo = productos.find(
    (p) => p.id === variedad.productoId && !p.activo
  )

  const productoOptions = [
    ...productos
      .filter((p) => p.activo)
      .map((p) => ({ value: String(p.id), label: p.nombre })),
    ...(productoAsignadoInactivo
      ? [
          {
            value: String(productoAsignadoInactivo.id),
            label: `${productoAsignadoInactivo.nombre} (inactivo)`,
          },
        ]
      : []),
  ]

  return (
    <VariedadEditFormReady
      variedad={variedad}
      productoOptions={productoOptions}
      productoAsignadoInactivo={!!productoAsignadoInactivo}
      isPending={isPending}
      onUpdate={update}
      onClose={onClose}
    />
  )
}

// Se extrae solo para que el useForm tenga las options ya listas al inicializar
interface ReadyProps {
  variedad: Variedad
  productoOptions: { value: string; label: string }[]
  productoAsignadoInactivo: boolean
  isPending: boolean
  onUpdate: ReturnType<typeof useUpdateVariedad>["mutate"]
  onClose: () => void
}

function VariedadEditFormReady({
  variedad,
  productoOptions,
  productoAsignadoInactivo,
  isPending,
  onUpdate,
  onClose,
}: ReadyProps) {
  const { control, handleSubmit, reset } = useForm<VariedadFormInput>({
    resolver: zodResolver(variedadSchema),
    defaultValues: {
      nombre: variedad.nombre,
      // String() para que el Select haga match con su value prop
      productoId: String(variedad.productoId) as unknown as number,
      activo: variedad.activo,
    },
  })

  function onSubmit(data: VariedadFormInput) {
    onUpdate({
      id: variedad.id,
      payload: {
        nombre: data.nombre,
        productoId: Number(data.productoId),
        activo: data.activo,
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormSelect
          name="productoId"
          label="Semilla"
          placeholder="Selecciona una semilla"
          options={productoOptions}
          control={control as never}
          disabled={isPending}
          description={
            productoAsignadoInactivo
              ? "La semilla asignada está inactiva. Considera cambiarla."
              : undefined
          }
        />
        <FormInput
          name="nombre"
          label="Nombre de la variedad"
          placeholder="Ej: MAC-18"
          control={control}
          disabled={isPending}
        />
        <FormCheckbox
          name="activo"
          label="Variedad activa"
          control={control}
          disabled={isPending}
          required={false}
        />
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              reset()
              onClose()
            }}
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </DialogFooter>
    </form>
  )
}
