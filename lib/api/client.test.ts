import { api, ApiError } from './client'

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('api client', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns the body on success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ data: { id: 1 } })))
    await expect(api.get('/x')).resolves.toEqual({ data: { id: 1 } })
  })

  it('throws an ApiError carrying the API error code', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: { code: 'NOT_FOUND', message: 'Gone' } }, 404))
    )
    await expect(api.get('/x')).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND', message: 'Gone' })
  })

  it('throws an ApiError when an error response has no JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Bad gateway', { status: 502 })))
    await expect(api.get('/x')).rejects.toBeInstanceOf(ApiError)
  })

  it('maps network failures to an ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(api.get('/x')).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('rethrows aborts untouched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError')))
    await expect(api.get('/x')).rejects.toMatchObject({ name: 'AbortError' })
  })
})
