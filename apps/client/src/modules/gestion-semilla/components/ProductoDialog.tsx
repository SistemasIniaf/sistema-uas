import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { FormInput } from "@/components/form/FormInput"
import { FormCheckbox } from "@/components/form/FormCheckbox"
import { FieldGroup } from "@/components/ui/field"

import { productoSchema } from "../lib/gestion-semilla.schemas"
import {
  useCreateProducto,
  useUpdateProducto,
} from "../hooks/useGestionSemillaMutations"
import type { ProductoFormInput } from "../lib/gestion-semilla.schemas"
import type { Producto } from "../types/gestion-semilla.types"

// ── Form ──────────────────────────────────────────────────────────────────────

interface ProductoFormProps {
  producto?: Producto
  onClose?: () => void
}

function ProductoForm({ producto, onClose }: ProductoFormProps) {
  const isEditing = !!producto

  const { mutate: create, isPending: isCreating } = useCreateProducto({
    onSuccess: onClose,
  })
  const { mutate: update, isPending: isUpdating } = useUpdateProducto({
    onSuccess: onClose,
  })
  const isPending = isCreating || isUpdating

  const { control, handleSubmit, reset } = useForm<ProductoFormInput>({
    resolver: zodResolver(productoSchema),
    defaultValues: { nombre: "", activo: true },
  })

  useEffect(() => {
    if (producto) {
      reset({ nombre: producto.nombre, activo: producto.activo })
    } else {
      reset({ nombre: "", activo: true })
    }
  }, [producto, reset])

  function onSubmit(data: ProductoFormInput) {
    if (isEditing) {
      update({ id: producto.id, payload: data })
    } else {
      create(data)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <FormInput
          name="nombre"
          label="Nombre"
          placeholder="Ej: Arroz"
          control={control}
          disabled={isPending}
        />
        {isEditing && (
          <FormCheckbox
            name="activo"
            label="Producto activo"
            control={control}
            disabled={isPending}
            required={false}
          />
        )}
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              reset()
              onClose?.()
            }}
          >
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

// ── Create Dialog ─────────────────────────────────────────────────────────────

export function ProductoCreateDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Nueva Semilla
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear semilla</DialogTitle>
          <DialogDescription>
            Registra una nueva semilla en el catálogo.
          </DialogDescription>
        </DialogHeader>
        <ProductoForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

interface ProductoEditDialogProps {
  producto: Producto
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductoEditDialog({
  producto,
  open,
  onOpenChange,
}: ProductoEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar semilla</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium text-foreground">
              {producto.nombre}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <ProductoForm producto={producto} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
