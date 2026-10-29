import { formatRelativeTime } from '@/lib/utils'

type Props = {
  iso: string
}

export function RelativeTime({ iso }: Props) {
  return (
    <time dateTime={iso} title={new Date(iso).toLocaleString()}>
      {formatRelativeTime(iso)}
    </time>
  )
}
