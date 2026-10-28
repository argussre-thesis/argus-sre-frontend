import { Badge } from '@/components/ui/badge'
import type { StatusInfo } from '@/lib/status'

type Props = {
  status: StatusInfo
}

export function StatusBadge({ status }: Props) {
  return <Badge variant={status.variant}>{status.label}</Badge>
}
