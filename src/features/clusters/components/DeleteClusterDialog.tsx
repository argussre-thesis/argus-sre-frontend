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
import { useDeleteCluster } from '@/features/clusters/hooks'
import type { Cluster } from '@/types/cluster'

type Props = {
  cluster: Cluster
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClusterDialog({ cluster, open, onOpenChange }: Props) {
  const remove = useDeleteCluster(cluster.id)

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) remove.reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete cluster {cluster.name}?</DialogTitle>
          <DialogDescription>
            Its runner token stops working and the cluster is removed from your alert sources. Its
            past incidents are kept and show "unknown cluster". This can't be undone.
          </DialogDescription>
        </DialogHeader>
        {remove.isError && (
          <ErrorState
            title="Couldn't delete the cluster"
            error={remove.error}
            onRetry={() => remove.mutate()}
          />
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate()}>
            {remove.isPending ? 'Deleting…' : 'Delete cluster'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
