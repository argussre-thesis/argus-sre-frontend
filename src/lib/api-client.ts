import { getToken } from '@clerk/react'

export const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
if (!apiUrl) {
  throw new Error('VITE_API_URL is not set: copy .env.example to .env.local')
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details: unknown

  constructor(status: number, code: string, message: string, details: unknown = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const token = await getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(`${apiUrl}/api/v1${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the server')
  }

  const json: unknown = await res.json().catch(() => null)
  if (res.ok && isRecord(json) && json.success === true) {
    return json.data as T
  }
  if (
    isRecord(json) &&
    isRecord(json.error) &&
    typeof json.error.code === 'string' &&
    typeof json.error.message === 'string'
  ) {
    throw new ApiError(res.status, json.error.code, json.error.message, json.error.details ?? null)
  }
  // Not the backend's envelope, e.g. the rate limiter's 429 or a proxy error page.
  const message = isRecord(json) && typeof json.message === 'string' ? json.message : res.statusText
  throw new ApiError(res.status, `HTTP_${res.status}`, message)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
