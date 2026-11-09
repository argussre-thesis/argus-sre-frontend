import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DEFAULT_RANGE,
  parseRange,
  type IncidentPageFilters,
} from '@/features/incidents/incidentFilters'
import type { Cluster } from '@/types/cluster'

type Props = {
  filters: IncidentPageFilters
  clusters: Cluster[]
  onChange: (filters: IncidentPageFilters) => void
}

// Radix Select can't use an empty string as a value, so "all" stands for "no filter".
const ALL = 'all'

export function IncidentFilterBar({ filters, clusters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="search"
        className="w-64"
        placeholder="Search title or cluster"
        aria-label="Search incidents"
        value={filters.search ?? ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />
      <Tabs
        value={filters.status ?? ALL}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value === 'OPEN' || value === 'RESOLVED' ? value : undefined,
          })
        }
      >
        <TabsList>
          <TabsTrigger value={ALL}>All</TabsTrigger>
          <TabsTrigger value="OPEN">Open</TabsTrigger>
          <TabsTrigger value="RESOLVED">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>
      <Select
        value={filters.clusterId ?? ALL}
        onValueChange={(value) =>
          onChange({ ...filters, clusterId: value === ALL ? undefined : value })
        }
      >
        <SelectTrigger className="w-48" aria-label="Cluster">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All clusters</SelectItem>
          {clusters.map((cluster) => (
            <SelectItem key={cluster.id} value={cluster.id}>
              {cluster.name}
            </SelectItem>
          ))}
          <SelectItem value="unknown">Unknown cluster</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filters.range}
        onValueChange={(value) => onChange({ ...filters, range: parseRange(value) ?? DEFAULT_RANGE })}
      >
        <SelectTrigger className="w-40" aria-label="Time range">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
