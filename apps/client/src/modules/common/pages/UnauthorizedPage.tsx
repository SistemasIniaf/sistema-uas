import { useNavigate } from "react-router-dom"
import { ShieldOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldOffIcon className="size-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          No tienes permisos para acceder a esta sección. Contacta al
          administrador si crees que esto es un error.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate("/", { replace: true })}
      >
        Volver al inicio
      </Button>
    </div>
  )
}
