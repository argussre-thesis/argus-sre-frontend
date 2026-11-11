import { useId } from 'react'
import { CopyButton } from '@/components/common/CopyButton'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
  label: string
  value: string
}

export function CopyField({ label, value }: Props) {
  const id = useId()

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex gap-2">
        <Input
          id={id}
          readOnly
          value={value}
          className="font-mono"
          onFocus={(event) => event.target.select()}
        />
        <CopyButton label={label} value={value} />
      </div>
    </Field>
  )
}
