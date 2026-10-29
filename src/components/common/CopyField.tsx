import { Check, Copy } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
  label: string
  value: string
}

export function CopyField({ label, value }: Props) {
  const id = useId()
  const [copied, setCopied] = useState(false)

  function copy() {
    // If the browser refuses, the value can still be selected and copied by hand.
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      () => {},
    )
  }

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
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={copied ? 'Copied' : `Copy ${label}`}
          onClick={copy}
        >
          {copied ? <Check /> : <Copy />}
        </Button>
      </div>
    </Field>
  )
}
