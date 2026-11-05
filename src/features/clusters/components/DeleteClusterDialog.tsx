import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useDeleteCluster } from '@/features/clusters/hooks'
import type { Cluster } from '@/types/cluster'

type Props = {
  cluster: Cluster
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteClusterDialog({ cluster, open, onOpenChange }: Props) {
  const remove = useDeleteCluster(cluster.id)

  return (
    <ConfirmDialog
      title={`Delete cluster ${cluster.name}?`}
      description={`Its runner token stops working and the cluster is removed from your alert sources. Its past incidents are kept and show "unknown cluster". This can't be undone.`}
      confirmLabel="Delete cluster"
      pendingLabel="Deleting…"
      errorTitle="Couldn't delete the cluster"
      action={remove}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}
