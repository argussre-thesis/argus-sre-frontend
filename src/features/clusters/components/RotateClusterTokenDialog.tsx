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
import { useRotateClusterToken } from '@/features/clusters/hooks'
import type { Cluster } from '@/types/cluster'

type Props = {
  cluster: Cluster
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RotateClusterTokenDialog({ cluster, open, onOpenChange }: Props) {
  const rotate = useRotateClusterToken(cluster.id)

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
              <DialogTitle>New runner token for {cluster.name}</DialogTitle>
              <DialogDescription>
                Copy the token and update the runner with it. The old token no longer works. It is
                shown only once.
              </DialogDescription>
            </DialogHeader>
            <CopyField label="Runner token" value={rotate.data.token} />
            <DialogFooter>
              <DialogClose asChild>
                <Button>Done</Button>
              </DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Rotate the runner token for {cluster.name}?</DialogTitle>
              <DialogDescription>
                You get a new token, and the current one stops working at once. The runner can't
                connect until you update it with the new token.
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
