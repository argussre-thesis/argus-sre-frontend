import { Plug } from 'lucide-react'
import { integrations } from '@/features/landing/integrations'

const safety = [
  { title: 'Read-only in your cluster', text: "The runner can't change anything, and it can't read Secrets." },
  { title: 'No inbound ports', text: 'The runner opens the connection to Argus, so your firewall stays closed.' },
  { title: 'One token per purpose', text: 'Runner and webhook tokens are shown once, stored only as a hash, and can be rotated at any time.' },
]

export function LandingFacts() {
  return (
    <section className="grid gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">Works with what you already run</h2>
        <ul className="flex flex-col gap-4">
          {integrations.map((item) => (
            <li key={item.name} className="flex gap-3">
              <img src={item.logo} alt="" className={`size-6 shrink-0 ${item.logoClass ?? ''}`} />
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
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">Safe to put in a production cluster</h2>
        <ul className="flex flex-col gap-4">
          {safety.map((item) => (
            <li key={item.title} className="flex flex-col gap-1 border-l-2 border-primary pl-4">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
