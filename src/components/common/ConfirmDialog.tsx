import type { UseMutationResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/common/ErrorState'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type Props = {
  trigger?: ReactNode
  title: string
  description: string
  confirmLabel: string
  pendingLabel: string
  errorTitle: string
  // Nothing here closes on success: the thing it acts on leaves the page, taking this dialog with it.
  action: UseMutationResult<unknown, Error, void>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  pendingLabel,
  errorTitle,
  action,
  open,
  onOpenChange,
}: Props) {
  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) action.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {action.isError && (
          <ErrorState title={errorTitle} error={action.error} onRetry={() => action.mutate()} />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={action.isPending} onClick={() => action.mutate()}>
            {action.isPending ? pendingLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
