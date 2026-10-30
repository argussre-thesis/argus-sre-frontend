import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  createAlertSource,
  deleteAlertSource,
  listAlertSources,
  rotateAlertSourceToken,
  updateAlertSource,
} from '@/features/alert-sources/api'
import type { CreateAlertSourceInput } from '@/types/alert-source'

export function useAlertSources() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['alert-sources', 'list', orgId],
    queryFn: () => listAlertSources(orgId),
  })
}

export function useCreateAlertSource() {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAlertSourceInput) => createAlertSource(orgId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert-sources', 'list', orgId] }),
  })
}

export function useUpdateAlertSource(alertSourceId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAlertSourceInput) => updateAlertSource(orgId, alertSourceId, input),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['alert-sources', 'list', orgId] }),
        // An incident's alerts show their source's name.
        queryClient.invalidateQueries({ queryKey: ['incidents'] }),
      ]),
  })
}

export function useRotateAlertSourceToken(alertSourceId: string) {
  const orgId = useOrgId()
  return useMutation({
    mutationFn: () => rotateAlertSourceToken(orgId, alertSourceId),
  })
}

export function useDeleteAlertSource(alertSourceId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteAlertSource(orgId, alertSourceId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['alert-sources', 'list', orgId] }),
        // Its alerts are kept and now show "Deleted source".
        queryClient.invalidateQueries({ queryKey: ['incidents'] }),
      ]),
  })
}
