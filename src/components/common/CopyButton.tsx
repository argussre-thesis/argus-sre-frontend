import { Check, Copy } from 'lucide-react'
import { useState, type ComponentProps } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  label: string
  value: string
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
}

export function CopyButton({ label, value, variant = 'outline', size = 'icon' }: Props) {
  const [copied, setCopied] = useState(false)

  function copy() {
    // If the browser refuses, nothing changes on the button, so it doesn't claim a copy.
    navigator.clipboard.writeText(value).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      () => {},
    )
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      title={`Copy ${label}`}
      aria-label={copied ? 'Copied' : `Copy ${label}`}
      onClick={copy}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}
