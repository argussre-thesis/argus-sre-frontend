import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type Message = {
  icon: LucideIcon
  variant: 'default' | 'destructive'
  title: string
  description: string
}

const messages: Record<string, Message> = {
  connected: {
    icon: CircleCheck,
    variant: 'default',
    title: 'Slack connected',
    description: 'Argus joined the channel and posted a test message.',
  },
  cannot_post: {
    icon: CircleAlert,
    variant: 'destructive',
    title: "Connected, but Argus can't post yet",
    description:
      "The test message failed, so reports won't reach the channel. If it's private, type /invite @argus there.",
  },
  cancelled: {
    icon: Info,
    variant: 'default',
    title: "Slack wasn't connected",
    description: 'The connection was cancelled on Slack.',
  },
  workspace_taken: {
    icon: CircleAlert,
    variant: 'destructive',
    title: 'This workspace is already in use',
    description:
      'It is connected to another Argus organization. Disconnect it there first, or choose another workspace.',
  },
  error: {
    icon: CircleAlert,
    variant: 'destructive',
    title: "Couldn't connect Slack",
    description: 'Something went wrong while connecting. Try again.',
  },
}

type Props = {
  outcome: string
}

export function SlackOutcomeAlert({ outcome }: Props) {
  // The value comes from the URL, and a plain lookup would match inherited names like "constructor".
  const message = Object.hasOwn(messages, outcome) ? messages[outcome] : undefined
  if (!message) return null

  return (
    <Alert variant={message.variant}>
      <message.icon />
      <AlertTitle>{message.title}</AlertTitle>
      <AlertDescription>{message.description}</AlertDescription>
    </Alert>
  )
}
