import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  id: string
  title: ReactNode
  description: string
  children: ReactNode
}

export function SettingsCard({ id, title, description, children }: Props) {
  return (
    <Card id={id} className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}
