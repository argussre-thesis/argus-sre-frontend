import { Card, CardContent } from '@/components/ui/card'

type Props = {
  label: string
  value: string
  hint: string
}

export function StatCard({ label, value, hint }: Props) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}
