import type { ApiErrorBody, ApiSuccess } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Status used when the request never got a response (offline, DNS, CORS...). */
export const NETWORK_ERROR_STATUS = 0

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    typeof (body as ApiErrorBody).error?.code === 'string'
  )
}

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiSuccess<T>> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })
  } catch (error) {
    // Let callers tell a deliberate cancel apart from a failure.
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(NETWORK_ERROR_STATUS, 'NETWORK_ERROR', 'Check your connection and try again.')
  }

  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    if (isApiErrorBody(body)) throw new ApiError(res.status, body.error.code, body.error.message)
    throw new ApiError(res.status, 'UNKNOWN_ERROR', `Request failed with status ${res.status}`)
  }
  if (body === null)
    throw new ApiError(res.status, 'INVALID_RESPONSE', 'The server sent an invalid response.')

  return body as ApiSuccess<T>
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
