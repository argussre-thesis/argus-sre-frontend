import type { IncidentFilters, IncidentListItem } from '@/types/incident'

const HOUR = 3_600_000

const rangeMs = {
  '24h': 24 * HOUR,
  '7d': 7 * 24 * HOUR,
  '30d': 30 * 24 * HOUR,
}

export type IncidentRange = keyof typeof rangeMs | 'all'

export const DEFAULT_RANGE: IncidentRange = '7d'

export type LocalIncidentFilters = {
  search?: string
  range: IncidentRange
}

export type IncidentPageFilters = IncidentFilters & LocalIncidentFilters

export function parseRange(value: string | null): IncidentRange | undefined {
  return value === '24h' || value === '7d' || value === '30d' || value === 'all' ? value : undefined
}

// The oldest createdAt (ms) a range keeps; undefined for all time.
export function rangeStart(range: IncidentRange, now = Date.now()) {
  return range === 'all' ? undefined : now - rangeMs[range]
}

// shortcut: the API has no search or date params, so this filters incidents already loaded
// (useIncidents loads a whole time range). Move these to query params once the backend has them.
export function filterIncidents(
  incidents: IncidentListItem[],
  { search, range }: LocalIncidentFilters,
  now = Date.now(),
): IncidentListItem[] {
  const term = search?.trim().toLowerCase()
  const start = rangeStart(range, now)
  return incidents.filter((incident) => {
    if (start !== undefined && Date.parse(incident.createdAt) < start) return false
    if (!term) return true
    return [incident.title, incident.cluster?.name ?? ''].some((text) =>
      text.toLowerCase().includes(term),
    )
  })
}

function repeatKey(incident: IncidentListItem) {
  return `${incident.cluster?.id ?? 'unknown'}|${incident.title}`
}

// How many of the given incidents share this one's title and cluster, e.g. a flapping alert.
export function repeatCounter(incidents: IncidentListItem[]) {
  const counts = new Map<string, number>()
  for (const incident of incidents) {
    counts.set(repeatKey(incident), (counts.get(repeatKey(incident)) ?? 0) + 1)
  }
  return (incident: IncidentListItem) => counts.get(repeatKey(incident)) ?? 1
}

export function incidentDurationMs(incident: IncidentListItem, now = Date.now()) {
  const end = incident.resolvedAt ? Date.parse(incident.resolvedAt) : now
  return end - Date.parse(incident.createdAt)
}

export function incidentStats(recent: IncidentListItem[], now = Date.now()) {
  const resolved = recent.filter((incident) => incident.resolvedAt)
  const total = resolved.reduce((sum, incident) => sum + incidentDurationMs(incident), 0)
  return {
    last24h: recent.filter((incident) => now - Date.parse(incident.createdAt) <= rangeMs['24h']).length,
    mttrMs: resolved.length > 0 ? total / resolved.length : null,
    resolvedCount: resolved.length,
  }
}
