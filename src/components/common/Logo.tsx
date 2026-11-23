type Props = {
  className?: string
}

// Inline rather than an <img> so the mark takes the text color of the theme it sits in.
export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className} aria-hidden>
      <path d="M32 6 L59 58 L46 58 L32 30 L18 58 L5 58 Z" />
      <circle cx="32" cy="49" r="5" />
    </svg>
  )
}
