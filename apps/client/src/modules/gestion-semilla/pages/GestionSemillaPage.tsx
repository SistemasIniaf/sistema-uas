import { Layers, Leaf, Tag } from "lucide-react"
import { VariedadesTable } from "../components/VariedadesTable"
import { ProductosTable } from "../components/ProductosTable"
import { CategoriasTable } from "../components/CategoriasTable"

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div>
          <h2 className="text-sm leading-none font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default function GestionSemillaPage() {
  return (
    <div className="flex flex-col gap-4">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-primary dark:text-foreground">
          Gestión de Semillas, Variedades y Categorías
        </h1>
        <p className="text-sm text-muted-foreground">
          Administra el catálogo de semillas, sus variedades y las categorías
          disponibles.
        </p>
      </div>

      {/* Semillas y Variedades */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          icon={Layers}
          title="Variedades"
          description="Gestiona las variedades de semillas disponibles"
        >
          <VariedadesTable />
        </SectionCard>

        <SectionCard
          icon={Leaf}
          title="Semillas"
          description="Gestiona el catálogo de semillas disponibles"
        >
          <ProductosTable />
        </SectionCard>
      </div>

      {/* Categorias */}
      <SectionCard
        icon={Tag}
        title="Categorías"
        description="Gestiona las categorías de semillas"
      >
        <CategoriasTable />
      </SectionCard>
    </div>
  )
}
