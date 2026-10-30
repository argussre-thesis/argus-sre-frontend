import { useAuth } from '@clerk/react'

// Only decides what to show; the backend checks the role on every request.
export function useIsOrgAdmin(): boolean {
  return useAuth().orgRole === 'org:admin'
}
