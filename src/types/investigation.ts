export type InvestigationStatus = 'running' | 'done' | 'failed'

export type Investigation = {
  id: string
  tenantId: string
  incidentId: string
  cluster: string
  model: string
  effort: string
  status: InvestigationStatus
  // Markdown RCA, null until done.
  report: string | null
  // Why it failed, null unless failed.
  error: string | null
  startedAt: string
  finishedAt: string | null
}
