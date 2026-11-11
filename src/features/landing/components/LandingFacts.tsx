import { Plug } from 'lucide-react'
import { integrations } from '@/features/landing/integrations'
import { cn } from '@/lib/utils'

export function LandingFacts() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold tracking-tight">Works with what you already run</h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((item) => (
          <li key={item.name} className="flex gap-3">
            <img src={item.logo} alt="" className={cn('size-6 shrink-0', item.logoClass)} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{item.name}.</span> {item.text}
            </p>
          </li>
        ))}
        <li className="flex gap-3">
          <Plug className="size-6 shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Any MCP server.</span> Give the agent your own tools
            with a URL and a token.
          </p>
        </li>
      </ul>
    </section>
  )
}
