import { useAuth } from '@clerk/react'

// ProtectedLayout only renders pages once an organization is active, so pages can rely on it.
export function useOrgId(): string {
  const { orgId } = useAuth()
  if (!orgId) throw new Error('useOrgId must be used inside ProtectedLayout')
  return orgId
}
