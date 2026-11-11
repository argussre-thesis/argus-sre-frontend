import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  emptyHeaderRow,
  maxHeaders,
  type HeaderRow,
} from '@/features/mcp-servers/mcpServerHeaders'

type Props = {
  rows: HeaderRow[]
  onChange: (rows: HeaderRow[]) => void
  error: string | undefined
  description: string
  showValues?: boolean
}

export function McpServerHeadersField({
  rows,
  onChange,
  error,
  description,
  showValues = false,
}: Props) {
  function updateRow(index: number, change: Partial<HeaderRow>) {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...change } : row)))
  }

  return (
    <FieldSet className="gap-2">
      <FieldLegend variant="label">Headers</FieldLegend>
      {rows.map((row, index) => (
        <div key={index} className="flex items-start gap-2">
          <Input
            aria-label={`Header ${index + 1} name`}
            value={row.name}
            onChange={(event) => updateRow(index, { name: event.target.value })}
            required
            maxLength={100}
            placeholder="api-key"
            autoComplete="off"
          />
          {/* "new-password" keeps password managers out, as on the token field. */}
          <Input
            aria-label={`Header ${index + 1} value`}
            type={showValues ? 'text' : 'password'}
            value={row.value}
            onChange={(event) => updateRow(index, { value: event.target.value })}
            required
            maxLength={8192}
            placeholder="Value"
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove header ${index + 1}`}
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          >
            <X />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={rows.length >= maxHeaders}
        onClick={() => onChange([...rows, emptyHeaderRow])}
      >
        <Plus />
        Add header
      </Button>
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{error}</FieldError>
    </FieldSet>
  )
}
