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

// For URLs that come from alert senders: only web pages become links, never javascript: and the like.
export function webUrl(url: string | null | undefined): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null
}
