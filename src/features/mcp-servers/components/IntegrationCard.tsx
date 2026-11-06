import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  icon: ReactNode
  dialog: ReactNode
  description: string
  footer?: ReactNode
}

export function IntegrationCard({ icon, dialog, description, footer }: Props) {
  return (
    <Card className="relative hover:bg-muted has-[button:focus-visible]:ring-2 has-[button:focus-visible]:ring-ring">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {dialog}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {/* Sits above the card's stretched button, so a link here stays clickable. */}
      {footer && <CardContent className="relative z-10 mt-auto w-fit">{footer}</CardContent>}
    </Card>
  )
}
