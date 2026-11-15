import { CopyButton } from '@/components/common/CopyButton'
import type { CommandStep } from '@/features/clusters/runnerInstall'

type Props = {
  title: string
  steps: CommandStep[]
  note: string
}

export function CommandSteps({ title, steps, note }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-sm font-medium">{title}</h3>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step.label} className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {index + 1}. {step.label}
            </p>
            <div className="flex items-start gap-2">
              <pre className="min-w-0 flex-1 overflow-x-auto rounded-md border bg-muted p-2 font-mono text-xs">
                <code>{step.command}</code>
              </pre>
              <CopyButton label={`command: ${step.label}`} value={step.command} />
            </div>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">{note}</p>
    </section>
  )
}
