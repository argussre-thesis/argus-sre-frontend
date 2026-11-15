import { useId } from 'react'
import { Link } from 'react-router'
import { ErrorState } from '@/components/common/ErrorState'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { useClusters } from '@/features/clusters/hooks'

type Props = {
  selected: string[]
  onChange: (clusterIds: string[]) => void
}

export function ClusterChecklist({ selected, onChange }: Props) {
  const id = useId()
  const clusters = useClusters()

  function toggle(clusterId: string, checked: boolean) {
    onChange(checked ? [...selected, clusterId] : selected.filter((other) => other !== clusterId))
  }

  function renderOptions() {
    if (clusters.isPending) {
      return <Skeleton className="h-16 w-full" />
    }
    if (clusters.isError) {
      return (
        <ErrorState
          title="Couldn't load clusters"
          error={clusters.error}
          onRetry={() => clusters.refetch()}
        />
      )
    }
    if (clusters.data.length === 0) {
      return (
        <FieldDescription>
          No clusters yet. <Link to="/app/clusters">Add a cluster</Link> first.
        </FieldDescription>
      )
    }
    return (
      <FieldGroup data-slot="checkbox-group">
        {clusters.data.map((cluster) => (
          <Field key={cluster.id} orientation="horizontal">
            <Checkbox
              id={`${id}-${cluster.id}`}
              checked={selected.includes(cluster.id)}
              onCheckedChange={(checked) => toggle(cluster.id, checked === true)}
            />
            <FieldLabel htmlFor={`${id}-${cluster.id}`} className="font-normal">
              {cluster.name}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    )
  }

  return (
    <FieldSet>
      <FieldLegend variant="label">Clusters</FieldLegend>
      <FieldDescription>
        The clusters this source sends alerts for. Alerts for any other cluster show as unknown
        cluster and aren't investigated.
      </FieldDescription>
      {renderOptions()}
    </FieldSet>
  )
}
