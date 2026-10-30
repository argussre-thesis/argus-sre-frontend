import { CopyField } from '@/components/common/CopyField'
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
import { webhookUrl } from '@/features/alert-sources/api'
import { useRotateAlertSourceToken } from '@/features/alert-sources/hooks'
import type { AlertSource } from '@/types/alert-source'

type Props = {
  alertSource: AlertSource
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RotateAlertSourceTokenDialog({ alertSource, open, onOpenChange }: Props) {
  const rotate = useRotateAlertSourceToken(alertSource.id)

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) rotate.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        // The token is never shown again, so a stray click outside must not close it.
        onInteractOutside={rotate.data ? (event) => event.preventDefault() : undefined}
      >
        {rotate.data ? (
          <>
            <DialogHeader>
              <DialogTitle>New webhook token for {alertSource.name}</DialogTitle>
              <DialogDescription>
                Update the sender's authorization header with the new token. The old token no
                longer works. It is shown only once.
              </DialogDescription>
            </DialogHeader>
            <CopyField label="Webhook URL" value={webhookUrl} />
            <CopyField label="Webhook token" value={rotate.data.token} />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rotate the webhook token for {alertSource.name}?</DialogTitle>
              <DialogDescription>
                You get a new token, and the current one stops working at once. Alerts from this
                sender are rejected until you update it with the new token.
              </DialogDescription>
            </DialogHeader>
            {rotate.isError && (
              <ErrorState
                title="Couldn't rotate the token"
                error={rotate.error}
                onRetry={() => rotate.mutate()}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button disabled={rotate.isPending} onClick={() => rotate.mutate()}>
                {rotate.isPending ? 'Rotating…' : 'Rotate token'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
