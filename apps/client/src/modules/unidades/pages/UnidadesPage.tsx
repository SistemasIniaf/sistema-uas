import { UnidadCreateDialog } from "../components/UnidadDialog"
import { UnidadesTable } from "../components/UnidadesTable"

export default function UnidadesPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-foreground">
            Unidades
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las unidades organizacionales del sistema.
          </p>
        </div>
        <UnidadCreateDialog />
      </div>

      {/* Tabla con paginación y búsqueda */}
      <UnidadesTable />
    </div>
  )
}
