import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Outlet } from "react-router"
import { ModeToggle } from "@/widgets/toggle-theme"

export default function AppLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SidebarTrigger className="m-4 " />
        <Outlet />
        <div className="fixed bottom-6 right-6">
          <ModeToggle />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}