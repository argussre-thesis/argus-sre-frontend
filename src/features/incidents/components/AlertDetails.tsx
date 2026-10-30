import { RelativeTime } from '@/components/common/RelativeTime'
import { Badge } from '@/components/ui/badge'
import { webUrl } from '@/lib/utils'
import type { IncidentAlert } from '@/types/incident'

type Props = {
  alert: IncidentAlert
}

export function AlertDetails({ alert }: Props) {
  const labels = Object.entries(alert.labels)
  const annotations = Object.entries(alert.annotations)

  return (
    <dl className="flex flex-col gap-3 py-2 whitespace-normal">
      {labels.length > 0 && (
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Labels</dt>
          <dd className="flex flex-wrap gap-1">
            {labels.map(([key, value]) => (
              <Badge key={key} variant="secondary" className="font-mono">
                {key}={value}
              </Badge>
            ))}
          </dd>
        </div>
      )}
      {annotations.map(([key, value]) => {
        const href = webUrl(value)
        return (
          <div key={key} className="flex flex-col gap-1">
            <dt className="font-mono text-muted-foreground">{key}</dt>
            <dd className="whitespace-pre-wrap wrap-break-word">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        )
      })}
      {alert.endsAt && (
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Ended</dt>
          <dd>
            <RelativeTime iso={alert.endsAt} />
          </dd>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <dt className="text-muted-foreground">Fingerprint</dt>
        <dd className="font-mono break-all">{alert.fingerprint}</dd>
      </div>
    </dl>
  )
}
