import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function TableCard({ children }: Props) {
  return <div className="overflow-hidden rounded-lg border bg-card [&_thead]:bg-muted/50">{children}</div>
}
