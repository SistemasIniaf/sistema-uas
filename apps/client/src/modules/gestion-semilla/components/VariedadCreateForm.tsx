import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { FieldGroup } from "@/components/ui/field"

import { variedadSchema } from "../lib/gestion-semilla.schemas"
import { useCreateVariedad } from "../hooks/useGestionSemillaMutations"
import { useProductosAll } from "../hooks/useGestionSemilla"
import type { VariedadFormInput } from "../lib/gestion-semilla.schemas"

interface Props {
  defaultProductoId?: number
  onClose: () => void
}

export function VariedadCreateForm({ defaultProductoId, onClose }: Props) {
  const { data: productos = [], isLoading } = useProductosAll(true)
  const { mutate: create, isPending } = useCreateVariedad({
    onSuccess: onClose,
  })

  const productoOptions = productos.map((p) => ({
    value: String(p.id),
    label: p.nombre,
  }))

  const { control, handleSubmit, reset } = useForm<VariedadFormInput>({
    resolver: zodResolver(variedadSchema),
    defaultValues: {
      nombre: "",
      productoId: defaultProductoId
        ? (String(defaultProductoId) as unknown as number)
        : (undefined as unknown as number),
      activo: true,
    },
  })

  function onSubmit(data: VariedadFormInput) {
    create({
      nombre: data.nombre,
      productoId: Number(data.productoId),
      activo: data.activo,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormSelect
          name="productoId"
          label="Semilla"
          placeholder={isLoading ? "Cargando..." : "Selecciona una semilla"}
          options={productoOptions}
          control={control as never}
          disabled={isPending || isLoading}
        />
        <FormInput
          name="nombre"
          label="Nombre de la variedad"
          placeholder="Ej: MAC-18"
          control={control}
          disabled={isPending}
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
          {isPending ? "Registrando..." : "Registrar"}
        </Button>
      </DialogFooter>
    </form>
  )
}
