import { Outlet } from "react-router-dom"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/modules/dashboard/components/AppSidebar"
import { DynamicBreadcrumb } from "../components/DynamicBreadcrumb"
import { NavUser } from "../components/NavUser"
import { useMe } from "@/modules/auth/hooks/useMe"
import { useUser } from "@/store/auth.store"

export const DashboardLayout = () => {
  useMe()
  const user = useUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          {/* Izquierda: trigger + separador + breadcrumb */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DynamicBreadcrumb />
          </div>

          <NavUser
            user={{
              name: user?.nombre ?? "",
              rol: user?.rol ?? "",
              avatar: "",
            }}
          />
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
