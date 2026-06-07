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

import { categoriaSchema } from "../lib/gestion-semilla.schemas"
import {
  useCreateCategoria,
  useUpdateCategoria,
} from "../hooks/useGestionSemillaMutations"
import type { CategoriaFormInput } from "../lib/gestion-semilla.schemas"
import type { Categoria } from "../types/gestion-semilla.types"

// ── Form ──────────────────────────────────────────────────────────────────────

interface CategoriaFormProps {
  categoria?: Categoria
  onClose?: () => void
}

function CategoriaForm({ categoria, onClose }: CategoriaFormProps) {
  const isEditing = !!categoria

  const { mutate: create, isPending: isCreating } = useCreateCategoria({
    onSuccess: onClose,
  })
  const { mutate: update, isPending: isUpdating } = useUpdateCategoria({
    onSuccess: onClose,
  })
  const isPending = isCreating || isUpdating

  const { control, handleSubmit, reset } = useForm<CategoriaFormInput>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: { nombre: "", activo: true },
  })

  useEffect(() => {
    if (categoria) {
      reset({ nombre: categoria.nombre, activo: categoria.activo })
    } else {
      reset({ nombre: "", activo: true })
    }
  }, [categoria, reset])

  function onSubmit(data: CategoriaFormInput) {
    if (isEditing) {
      update({ id: categoria.id, payload: data })
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
          placeholder="Ej: Certificada"
          control={control}
          disabled={isPending}
        />
        {isEditing && (
          <FormCheckbox
            name="activo"
            label="Categoría activa"
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

export function CategoriaCreateDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Nueva Categoría
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Crear categoría</DialogTitle>
          <DialogDescription>
            Registra una nueva categoría de semilla.
          </DialogDescription>
        </DialogHeader>
        <CategoriaForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

interface CategoriaEditDialogProps {
  categoria: Categoria
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CategoriaEditDialog({
  categoria,
  open,
  onOpenChange,
}: CategoriaEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Editar categoría</DialogTitle>
          <DialogDescription>
            Modifica los datos de{" "}
            <span className="font-medium text-foreground">
              {categoria.nombre}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <CategoriaForm
          categoria={categoria}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
