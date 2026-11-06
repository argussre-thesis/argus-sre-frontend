import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Props = {
  trigger?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AdminRequiredDialog({ trigger, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin privileges required</DialogTitle>
          <DialogDescription>
            Only organization admins can do this. Ask an admin in your organization for help.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  )
}
