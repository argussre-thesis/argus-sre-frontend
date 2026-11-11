import { useState } from 'react'
import { FlowDiagram } from '@/features/landing/components/FlowDiagram'
import { FlowSteps } from '@/features/landing/components/FlowSteps'

export function FlowAnimation() {
  const [scene, setScene] = useState(0)

  return (
    <section id="how-it-works" className="flex scroll-mt-6 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">From alert to root cause</h2>
        <p className="text-muted-foreground">What happens between an alert firing and the report landing.</p>
      </div>
      <div className="grid items-start gap-12 lg:grid-cols-3">
        <FlowSteps scene={scene} onSceneChange={setScene} />
        {/* The diagram is too wide to read on a phone, so small screens get the steps alone. */}
        <div className="hidden rounded-lg border p-4 lg:sticky lg:top-24 lg:col-span-2 lg:block">
          <FlowDiagram scene={scene} />
        </div>
      </div>
    </section>
  )
}
