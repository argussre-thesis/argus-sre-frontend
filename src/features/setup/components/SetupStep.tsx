import { Link } from 'react-router'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { setupStepDone } from '@/lib/status'

type Props = {
  title: string
  description: string
  done: boolean
  action: string
  to: string
}

export function SetupStep({ title, description, done, action, to }: Props) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="flex min-w-0 flex-col gap-1">
        <p className={done ? 'font-medium text-muted-foreground' : 'font-medium'}>{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {done ? (
        <StatusBadge status={setupStepDone} />
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link to={to}>{action}</Link>
        </Button>
      )}
    </li>
  )
}
