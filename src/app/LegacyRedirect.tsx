import { Navigate, useLocation } from 'react-router'

// App pages lived at the root before they moved under /app. Slack messages already posted, and the
// backend's Slack install redirect, still point at the old addresses.
export function LegacyRedirect() {
  const { pathname, search } = useLocation()
  return <Navigate to={`/app${pathname}${search}`} replace />
}
