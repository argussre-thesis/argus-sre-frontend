import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSendContactMessage } from '@/features/contact/hooks'

const MAX_MESSAGE_LENGTH = 5000

type Props = {
  defaultEmail?: string
}

export function ContactForm({ defaultEmail = '' }: Props) {
  const [email, setEmail] = useState(defaultEmail)
  const [message, setMessage] = useState('')
  const send = useSendContactMessage()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    send.mutate({ email: email.trim(), message: message.trim() })
  }

  if (send.isSuccess) {
    return (
      <div className="flex flex-col gap-1" role="status">
        <p className="font-medium">Message sent</p>
        <p className="text-muted-foreground">We reply to {email.trim()}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-6">
      <Field>
        <FieldLabel htmlFor="contact-email">Your email</FieldLabel>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={254}
          autoComplete="email"
        />
      </Field>
      <Field data-invalid={send.isError || undefined}>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={MAX_MESSAGE_LENGTH}
          rows={8}
          aria-invalid={send.isError || undefined}
        />
        {send.isError && (
          <FieldError>Your message wasn't sent: {send.error.message}. Try again.</FieldError>
        )}
      </Field>
      <Button type="submit" disabled={send.isPending} className="self-start">
        {send.isPending ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}
