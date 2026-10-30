import type { Cluster } from '@/types/cluster'

export type AlertSource = {
  id: string
  name: string
  // The label key holding the cluster name on each alert, not a cluster name.
  clusterLabel: string
  lastReceivedAt: string | null
  createdAt: string
  clusters: Pick<Cluster, 'id' | 'name'>[]
}

export type CreateAlertSourceInput = {
  name: string
  clusterIds: string[]
  clusterLabel?: string
}

export type CreatedAlertSource = {
  alertSource: AlertSource
  // The webhook token; the API returns it only once.
  token: string
}
