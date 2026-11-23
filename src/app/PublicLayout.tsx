import { useAuth } from '@clerk/react'
import { Link, Outlet } from 'react-router'
import { Logo } from '@/components/common/Logo'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { contactEnabled } from '@/lib/features'

const container = 'mx-auto w-full max-w-6xl px-6'

export function PublicLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className={`${container} flex h-14 items-center gap-2`}>
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Logo className="size-5 text-primary" />
            Argus
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {/* Nothing until Clerk loads, so a signed-in user never sees the sign-in buttons flash. */}
            {isLoaded && isSignedIn && (
              <Button asChild>
                <Link to="/app">Open the app</Link>
              </Button>
            )}
            {isLoaded && !isSignedIn && (
              <>
                <Button asChild variant="ghost">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link to="/sign-up">Create an account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={`${container} flex flex-1 flex-col py-16`}>
        <Outlet />
      </main>

      <footer className="border-t">
        <nav
          aria-label="Footer"
          className={`${container} flex h-14 items-center gap-6 text-sm text-muted-foreground`}
        >
          <span className="mr-auto">Argus SRE</span>
          {contactEnabled && (
            <Link to="/contact" className="hover:text-foreground">
              Contact
            </Link>
          )}
          <Link to="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </footer>
    </div>
  )
}
