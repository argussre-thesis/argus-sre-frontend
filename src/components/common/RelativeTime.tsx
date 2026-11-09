import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { formatRelativeTime } from '@/lib/utils'

type Props = {
  iso: string
}

export function RelativeTime({ iso }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <time dateTime={iso}>{formatRelativeTime(iso)}</time>
      </TooltipTrigger>
      <TooltipContent>{new Date(iso).toLocaleString()}</TooltipContent>
    </Tooltip>
  )
}
