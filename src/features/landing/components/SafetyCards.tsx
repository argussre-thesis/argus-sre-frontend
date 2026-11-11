import { KeyRound, Lock, ShieldCheck } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const safety = [
  { icon: Lock, title: 'Read-only in your cluster', text: "The runner can't change anything, and it can't read Secrets." },
  { icon: ShieldCheck, title: 'No inbound ports', text: 'The runner opens the connection to Argus, so your firewall stays closed.' },
  { icon: KeyRound, title: 'One token per purpose', text: 'Runner and webhook tokens are shown once, stored only as a hash, and can be rotated at any time.' },
]

export function SafetyCards() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">Safe to put in a production cluster</h2>
      <ul className="grid gap-4 md:grid-cols-3">
        {safety.map((item) => (
          <li key={item.title}>
            <Card className="h-full">
              <CardHeader>
                <item.icon className="size-5 text-primary" aria-hidden />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">{item.text}</CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
