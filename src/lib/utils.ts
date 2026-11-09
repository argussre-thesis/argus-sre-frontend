export { cn } from "cn"

const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" })

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
]

// "5 minutes ago", "yesterday": in the viewer's language. The API's times are UTC instants.
export function formatRelativeTime(iso: string, now = Date.now()): string {
  const seconds = (Date.parse(iso) - now) / 1000
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.trunc(seconds / size), unit)
  }
  return "just now"
}

// "42m", "3h 5m", "2d 4h". Two parts at most: a duration in a table only needs its rough size.
export function formatDuration(ms: number): string {
  const minutes = Math.floor(Math.max(ms, 0) / 60_000)
  if (minutes < 1) return "<1m"
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return minutes % 60 ? `${hours}h ${minutes % 60}m` : `${hours}h`
  const days = Math.floor(hours / 24)
  return hours % 24 ? `${days}d ${hours % 24}h` : `${days}d`
}

// For URLs that come from alert senders: only web pages become links, never javascript: and the like.
export function webUrl(url: string | null | undefined): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null
}
