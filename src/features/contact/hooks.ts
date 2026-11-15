import { useMutation } from '@tanstack/react-query'
import { sendContactMessage } from '@/features/contact/api'

export function useSendContactMessage() {
  return useMutation({ mutationFn: sendContactMessage })
}
