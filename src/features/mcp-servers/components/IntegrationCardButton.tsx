import type { ComponentProps } from 'react'

// The after: layer stretches the click area over the whole IntegrationCard.
export function IntegrationCardButton(props: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className="cursor-pointer font-medium outline-none after:absolute after:inset-0"
      {...props}
    />
  )
}
