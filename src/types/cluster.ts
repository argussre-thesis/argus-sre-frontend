export type Cluster = {
  id: string
  name: string
  lastConnectedAt: string | null
  createdAt: string
}

export type CreatedCluster = {
  cluster: Cluster
  // The runner token; the API returns it only once.
  token: string
}
