import { OrganizationList, useAuth, UserButton } from '@clerk/react'
import { Navigate, Outlet } from 'react-router'
import { AppSidebar } from '@/app/AppSidebar'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export function ProtectedLayout() {
  const { isLoaded, isSignedIn, orgId } = useAuth()

  if (!isLoaded) return null
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  // Everything in the backend is scoped to an organization, so a user must pick one first.
  if (!orgId) {
    return (
      <main className="flex min-h-svh items-center justify-center p-4">
        <OrganizationList hidePersonal />
      </main>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger aria-label="Toggle sidebar" />
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <UserButton />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-6 p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
