import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-prose text-muted-foreground">
        Nothing lives at this address. The link may be old, or the address may have a typo.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/app">Open the app</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Go to the home page</Link>
        </Button>
      </div>
    </div>
  )
}
