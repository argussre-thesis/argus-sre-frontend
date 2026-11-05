import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteMcpServer } from '@/features/mcp-servers/hooks'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServer: McpServer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteMcpServerDialog({ mcpServer, open, onOpenChange }: Props) {
  const remove = useDeleteMcpServer(mcpServer.id)

  return (
    <ConfirmDialog
      title={`Delete MCP server ${mcpServer.name}?`}
      description="Argus stops using its tools and its stored token is deleted. This can't be undone."
      confirmLabel="Delete MCP server"
      pendingLabel="Deleting…"
      errorTitle="Couldn't delete the MCP server"
      action={remove}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
