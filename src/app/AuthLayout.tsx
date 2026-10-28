import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Outlet />
    </main>
  )
}
