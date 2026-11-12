import type { ReactNode } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
  value: string
  onChange: (value: string) => void
  error: string | undefined
  required: boolean
  description: ReactNode
}

export function McpServerTokenField({ value, onChange, error, required, description }: Props) {
  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <FieldLabel htmlFor="mcp-server-token">Token</FieldLabel>
      {/* "new-password" keeps password managers out: a filled-in password would replace the stored token. */}
      <Input
        id="mcp-server-token"
        type="password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        maxLength={8192}
        pattern="\s*\S+\s*"
        title="Enter the token without spaces"
        autoComplete="new-password"
        aria-invalid={Boolean(error) || undefined}
      />
      <FieldDescription>{description}</FieldDescription>
      <FieldError>{error}</FieldError>
    </Field>
  )
}
