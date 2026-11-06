import { Ellipsis, Pencil, RotateCw, Trash2 } from 'lucide-react'
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
import { DeleteAlertSourceDialog } from '@/features/alert-sources/components/DeleteAlertSourceDialog'
import { EditAlertSourceDialog } from '@/features/alert-sources/components/EditAlertSourceDialog'
import { RotateAlertSourceTokenDialog } from '@/features/alert-sources/components/RotateAlertSourceTokenDialog'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
}

export function AlertSourceActions({ alertSource }: Props) {
  const isAdmin = useIsOrgAdmin()
  const [dialog, setDialog] = useState<'edit' | 'rotate' | 'delete' | null>(null)

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
          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${alertSource.name}`}>
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setDialog('edit')}>
            <Pencil />
            Edit
          </DropdownMenuItem>
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
      <EditAlertSourceDialog
        alertSource={alertSource}
        open={isAdmin && dialog === 'edit'}
        onOpenChange={handleOpenChange}
      />
      <RotateAlertSourceTokenDialog
        alertSource={alertSource}
        open={isAdmin && dialog === 'rotate'}
        onOpenChange={handleOpenChange}
      />
      <DeleteAlertSourceDialog
        alertSource={alertSource}
        open={isAdmin && dialog === 'delete'}
        onOpenChange={handleOpenChange}
      />
      <AdminRequiredDialog open={!isAdmin && dialog !== null} onOpenChange={handleOpenChange} />
    </>
  )
}
