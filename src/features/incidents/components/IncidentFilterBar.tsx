import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Cluster } from '@/types/cluster'
import type { IncidentFilters } from '@/types/incident'

type Props = {
  filters: IncidentFilters
  clusters: Cluster[]
  onChange: (filters: IncidentFilters) => void
}

// Radix Select can't use an empty string as a value, so "all" stands for "no filter".
const ALL = 'all'

export function IncidentFilterBar({ filters, clusters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
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
    </div>
  )
}
