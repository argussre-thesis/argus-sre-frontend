import { useQuery } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import { getOrganization } from '@/features/settings/api'

export function useCurrentOrganization() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['settings', 'organization', orgId],
    queryFn: () => getOrganization(orgId),
  })
}
