export type Organization = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  incidentGroupingWindowMinutes: number
  createdAt: string
  memberCount: number
  currentUserRole: string
}
