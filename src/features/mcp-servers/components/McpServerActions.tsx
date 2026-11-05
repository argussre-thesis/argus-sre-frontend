import { Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useIsOrgAdmin } from '@/app/useIsOrgAdmin'
import { AdminRequiredDialog } from '@/components/common/AdminRequiredDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteMcpServerDialog } from '@/features/mcp-servers/components/DeleteMcpServerDialog'
import { EditMcpServerDialog } from '@/features/mcp-servers/components/EditMcpServerDialog'
import type { McpServer } from '@/types/mcp-server'

type Props = {
  mcpServer: McpServer
}

export function McpServerActions({ mcpServer }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [dialog, setDialog] = useState<'edit' | 'delete' | null>(null)

  function handleOpenChange(open: boolean) {
    if (!open) setDialog(null)
  }

  return (
    <>
      <DropdownMenu
        // A modal menu that opens a modal dialog can leave the page unclickable (a known Radix issue).
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${mcpServer.name}`}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDialog('edit')}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDialog('delete')}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditMcpServerDialog
        mcpServer={mcpServer}
        open={isAdmin && dialog === 'edit'}
        onOpenChange={handleOpenChange}
      />
      <DeleteMcpServerDialog
        mcpServer={mcpServer}
        open={isAdmin && dialog === 'delete'}
        onOpenChange={handleOpenChange}
      />
      <AdminRequiredDialog open={!isAdmin && dialog !== null} onOpenChange={handleOpenChange} />
    </>
  )
}
