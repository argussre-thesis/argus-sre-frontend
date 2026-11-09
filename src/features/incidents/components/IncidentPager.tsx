import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  page: number
  hasPrevious: boolean
  hasNext: boolean
  loading: boolean
  onPrevious: () => void
  onNext: () => void
}

// Previous / Next only: the API pages by cursor and gives no total.
export function IncidentPager({ page, hasPrevious, hasNext, loading, onPrevious, onNext }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" disabled={!hasPrevious} onClick={onPrevious}>
        <ChevronLeft />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">Page {page}</span>
      <Button variant="outline" size="sm" disabled={!hasNext || loading} onClick={onNext}>
        {loading ? 'Loading…' : 'Next'}
        <ChevronRight />
      </Button>
    </div>
  )
}
