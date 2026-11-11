import { ClerkProvider } from '@clerk/react'
import { ui } from '@clerk/ui'
import { shadcn } from '@clerk/ui/themes'
import { Outlet, useNavigate } from 'react-router'

// ClerkProvider sits inside the router so Clerk navigates with React Router
// instead of full page reloads. It reads VITE_CLERK_PUBLISHABLE_KEY itself.
export function RootLayout() {
  const navigate = useNavigate()

  return (
    <ClerkProvider
      ui={ui}
      appearance={{ theme: shadcn }}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/app"
      signUpFallbackRedirectUrl="/app"
    >
      <Outlet />
    </ClerkProvider>
  )
}
