import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useOrgId } from '@/app/useOrgId'
import {
  createMcpServer,
  deleteMcpServer,
  listMcpServers,
  updateMcpServer,
} from '@/features/mcp-servers/api'
import type { CreateMcpServerInput, UpdateMcpServerInput } from '@/types/mcp-server'

export function useMcpServers() {
  const orgId = useOrgId()
  return useQuery({
    queryKey: ['mcp-servers', 'list', orgId],
    queryFn: () => listMcpServers(orgId),
  })
}

export function useCreateMcpServer() {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMcpServerInput) => createMcpServer(orgId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mcp-servers', 'list', orgId] }),
  })
}

export function useUpdateMcpServer(mcpServerId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateMcpServerInput) => updateMcpServer(orgId, mcpServerId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mcp-servers', 'list', orgId] }),
  })
}

export function useDeleteMcpServer(mcpServerId: string) {
  const orgId = useOrgId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteMcpServer(orgId, mcpServerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mcp-servers', 'list', orgId] }),
  })
}
