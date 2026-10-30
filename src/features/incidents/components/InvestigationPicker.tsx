import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { investigationStatus } from '@/lib/status'
import { formatRelativeTime } from '@/lib/utils'
import type { Investigation } from '@/types/investigation'

type Props = {
  // Newest first, as the API returns them.
  investigations: Investigation[]
  selectedId: string
  onSelect: (investigationId: string) => void
}

export function InvestigationPicker({ investigations, selectedId, onSelect }: Props) {
  return (
    <Select value={selectedId} onValueChange={onSelect}>
      <SelectTrigger size="sm" className="w-56" aria-label="Investigation run">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {investigations.map((run, index) => (
          <SelectItem key={run.id} value={run.id}>
            Run {investigations.length - index} · {investigationStatus[run.status].label} ·{' '}
            {formatRelativeTime(run.startedAt)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
