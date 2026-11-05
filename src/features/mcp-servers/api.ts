import { apiRequest } from '@/lib/api-client'
import type { CreateMcpServerInput, McpServer, UpdateMcpServerInput } from '@/types/mcp-server'

function mcpServersPath(orgId: string) {
  return `/organizations/${encodeURIComponent(orgId)}/mcp-servers`
}

export function listMcpServers(orgId: string) {
  return apiRequest<McpServer[]>(mcpServersPath(orgId))
}

export function createMcpServer(orgId: string, input: CreateMcpServerInput) {
  return apiRequest<McpServer>(mcpServersPath(orgId), { method: 'POST', body: input })
}

export function updateMcpServer(orgId: string, mcpServerId: string, input: UpdateMcpServerInput) {
  return apiRequest<McpServer>(`${mcpServersPath(orgId)}/${encodeURIComponent(mcpServerId)}`, {
    method: 'PATCH',
    body: input,
  })
}

export function deleteMcpServer(orgId: string, mcpServerId: string) {
  return apiRequest<null>(`${mcpServersPath(orgId)}/${encodeURIComponent(mcpServerId)}`, {
    method: 'DELETE',
  })
}
