import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AgentLevel } from '@/types/organization'

type Props = {
  id: string
  label: string
  description: string
  value: AgentLevel
  onChange: (value: AgentLevel) => void
  disabled: boolean
}

export function AgentLevelField({ id, label, description, value, onChange, disabled }: Props) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Select value={value} onValueChange={(v) => onChange(v as AgentLevel)} disabled={disabled}>
        <SelectTrigger id={id} className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  )
}
