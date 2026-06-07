import { UsuariosTable } from "../components/UsuariosTable"
import { UsuarioCreateDialog } from "../components/UsuarioDialog"

export const UsuariosPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-primary dark:text-foreground">
            Usuarios
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los usuarios del sistema.
          </p>
        </div>
        <UsuarioCreateDialog />
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <UsuariosTable />
      </div>
    </div>
  )
}
