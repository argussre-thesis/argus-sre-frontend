import { Ellipsis, RotateCw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DeleteClusterDialog } from '@/features/clusters/components/DeleteClusterDialog'
import { RotateClusterTokenDialog } from '@/features/clusters/components/RotateClusterTokenDialog'
import type { Cluster } from '@/types/cluster'

type Props = {
  cluster: Cluster
}

export function ClusterActions({ cluster }: Props) {
  const [dialog, setDialog] = useState<'rotate' | 'delete' | null>(null)

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
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${cluster.name}`}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDialog('rotate')}>
            <RotateCw />
            Rotate token
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={() => setDialog('delete')}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RotateClusterTokenDialog
        cluster={cluster}
        open={dialog === 'rotate'}
        onOpenChange={handleOpenChange}
      />
      <DeleteClusterDialog
        cluster={cluster}
        open={dialog === 'delete'}
        onOpenChange={handleOpenChange}
      />
    </>
  )
}
