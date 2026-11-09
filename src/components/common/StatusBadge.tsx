import { statusDot, type StatusInfo } from '@/lib/status'
import { cn } from '@/lib/utils'

type Props = {
  status: StatusInfo
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        status.variant === 'secondary' ? 'text-muted-foreground' : 'text-foreground',
      )}
    >
      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', statusDot[status.variant])} />
      {status.label}
    </span>
  )
}
