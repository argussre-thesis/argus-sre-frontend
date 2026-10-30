import { ChevronRight } from 'lucide-react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { defaultClusterLabel } from '@/features/alert-sources/api'

type Props = {
  value: string
  onChange: (value: string) => void
}

export function ClusterLabelField({ value, onChange }: Props) {
  const id = useId()

  return (
    // A source with a custom label opens with it visible, so editing it doesn't hide it.
    <Collapsible defaultOpen={value !== defaultClusterLabel} className="flex flex-col gap-4">
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="group/advanced self-start">
          <ChevronRight className="group-data-[state=open]/advanced:rotate-90" />
          Advanced
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Field>
          <FieldLabel htmlFor={id}>Cluster label</FieldLabel>
          {/* The backend's rule: a Prometheus label name. */}
          <Input
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
            pattern="[a-zA-Z_][a-zA-Z0-9_]*"
            className="font-mono"
            autoComplete="off"
          />
          <FieldDescription>
            The alert label that holds the cluster name, usually set by Prometheus{' '}
            <code>external_labels</code>. Its value must match a cluster name exactly. Most setups
            keep <code>cluster</code>.
          </FieldDescription>
        </Field>
      </CollapsibleContent>
    </Collapsible>
  )
}
