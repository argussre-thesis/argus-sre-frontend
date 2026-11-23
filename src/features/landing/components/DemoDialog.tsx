import type { ReactNode } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type Props = {
  video: 'demo' | 'setup'
  title: string
  trigger: ReactNode
}

export function DemoDialog({ video, title, trigger }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-h-dvh overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <video
          src={`/videos/${video}.mp4`}
          poster={`/videos/${video}-poster.jpg`}
          aria-label={title}
          className="aspect-video w-full rounded-lg border"
          autoPlay
          muted
          controls
          playsInline
        />
      </DialogContent>
    </Dialog>
  )
}
