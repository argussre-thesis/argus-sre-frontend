import { Dialog, DialogContent } from '@/components/ui/dialog'
import { EditMcpServerForm } from '@/features/mcp-servers/components/EditMcpServerForm'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServer: McpServer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditMcpServerDialog({ mcpServer, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-svh overflow-y-auto">
        {/* The form mounts on every open, so it starts from the server's current values. */}
        <EditMcpServerForm mcpServer={mcpServer} onSaved={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
