import type { TransactionStatus, TransactionType } from '@/types/api'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'

/** Everything about the user's place on the Transactions page, as stored in the URL. */
export interface TransactionsSearchState {
  q: string
  type: TransactionType | undefined
  status: TransactionStatus | undefined
  page: number
  /** Id of the transaction open in the details drawer. */
  tx: string | null
}

export type TransactionsSearchPatch = Partial<{
  [K in keyof TransactionsSearchState]: TransactionsSearchState[K] | null
}>

const isType = (value: string | null): value is TransactionType =>
  value !== null && Object.hasOwn(TRANSACTION_TYPE_LABELS, value)

const isStatus = (value: string | null): value is TransactionStatus =>
  value !== null && Object.hasOwn(TRANSACTION_STATUS_LABELS, value)

/** Read the page state from the URL. Anything invalid (hand-edited or stale links) falls back to the default. */
export function parseTransactionsSearch(params: Pick<URLSearchParams, 'get'>): TransactionsSearchState {
  const type = params.get('type')
  const status = params.get('status')
  const page = Number(params.get('page'))

  return {
    q: params.get('q')?.trim() ?? '',
    type: isType(type) ? type : undefined,
    status: isStatus(status) ? status : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    tx: params.get('tx') || null,
  }
}

/**
 * Apply a patch to the current query string. Unrelated params (e.g. `__scenario`) are kept, and defaults
 * are dropped so URLs stay short: page 1 and empty filters never appear.
 */
export function buildTransactionsSearch(
  current: { toString(): string },
  patch: TransactionsSearchPatch
): string {
  const params = new URLSearchParams(current.toString())
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined || value === '' || (key === 'page' && value === 1)) {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const hasActiveFilters = (state: TransactionsSearchState) =>
  Boolean(state.q || state.type || state.status)
