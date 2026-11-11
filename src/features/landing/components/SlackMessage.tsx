import { Eye } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  author: string
  time: string
  app?: boolean
  children: ReactNode
}

export function SlackMessage({ author, time, app, children }: Props) {
  return (
    <div className="flex gap-3">
      <div
        aria-hidden
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md text-xs font-medium',
          app ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        )}
      >
        {app ? <Eye className="size-4" /> : author.slice(0, 1)}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="flex items-center gap-2">
          <span className="font-semibold">{author}</span>
          {app && <Badge variant="outline">APP</Badge>}
          <span className="text-xs text-muted-foreground">{time}</span>
        </p>
        <div className="flex flex-col gap-2 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
