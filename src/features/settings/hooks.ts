import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  createSlackInstallUrl,
  disconnectSlack,
  getOrganization,
  getSlackStatus,
  updateOrganizationSettings,
} from '@/features/settings/api'
import type { Organization, OrganizationSettings } from '@/types/organization'

export function useCurrentOrganization() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['settings', 'organization', orgId],
    queryFn: () => getOrganization(orgId),
  })
}

export function useUpdateOrganizationSettings() {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: OrganizationSettings) => updateOrganizationSettings(orgId, settings),
    onSuccess: (settings) =>
      queryClient.setQueryData<Organization>(
        ['settings', 'organization', orgId],
        (org) => org && { ...org, ...settings },
      ),
  })
}

export function useSlackStatus() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['settings', 'slack', orgId],
    queryFn: () => getSlackStatus(orgId),
  })
}

export function useInstallSlack() {
  const orgId = useOrgId()
  return useMutation({
    mutationFn: () => createSlackInstallUrl(orgId),
    onSuccess: ({ url }) => window.location.assign(url),
  })
}

export function useDisconnectSlack() {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => disconnectSlack(orgId),
    // Also on failure: a 404 means someone else already disconnected, and the page should show that.
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['settings', 'slack', orgId] }),
  })
}
