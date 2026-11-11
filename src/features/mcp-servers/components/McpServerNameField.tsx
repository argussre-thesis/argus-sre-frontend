import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
  error: string | undefined
}

export function McpServerNameField({ value, onChange, error }: Props) {
  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <FieldLabel htmlFor="mcp-server-name">Name</FieldLabel>
      {/* The backend's rule. The "-" is escaped for the v-flag regex browsers use. */}
      <Input
        id="mcp-server-name"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        maxLength={20}
        pattern="[a-z0-9\-]+"
        placeholder="prod-grafana"
        autoComplete="off"
        aria-invalid={Boolean(error) || undefined}
      />
      <FieldDescription>
        Prefixes this server's tools, e.g. prod-grafana_query_prometheus. Up to 20 lowercase
        letters, numbers or hyphens.
      </FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  )
}
