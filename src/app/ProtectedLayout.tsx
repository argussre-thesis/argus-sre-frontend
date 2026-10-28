import {
  OrganizationList,
  OrganizationSwitcher,
  useAuth,
  UserButton,
} from '@clerk/react'
import { Navigate, Outlet } from 'react-router'

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
    <div className="min-h-svh">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <OrganizationSwitcher hidePersonal />
        <UserButton />
      </header>
      <Outlet />
    </div>
  )
}
