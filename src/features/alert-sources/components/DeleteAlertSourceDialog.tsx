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
} from '@/components/ui/dialog'
import { useDeleteAlertSource } from '@/features/alert-sources/hooks'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAlertSourceDialog({ alertSource, open, onOpenChange }: Props) {
  const remove = useDeleteAlertSource(alertSource.id)

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) remove.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete alert source {alertSource.name}?</DialogTitle>
          <DialogDescription>
            Its webhook token stops working, so alerts from this sender are rejected. Its past
            alerts and incidents are kept. This can't be undone.
          </DialogDescription>
        </DialogHeader>
        {remove.isError && (
          <ErrorState
            title="Couldn't delete the alert source"
            error={remove.error}
            onRetry={() => remove.mutate()}
          />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate()}>
            {remove.isPending ? 'Deleting…' : 'Delete alert source'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
