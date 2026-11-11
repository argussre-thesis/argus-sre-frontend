import { apiRequest } from '@/lib/api-client'
import type { ContactMessage } from '@/types/contact'

export function sendContactMessage(message: ContactMessage) {
  return apiRequest<unknown>('/contact', { method: 'POST', body: message })
}
