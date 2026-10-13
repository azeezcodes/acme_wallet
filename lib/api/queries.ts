'use client'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiSuccess, Transaction } from '@/types/api'
import { getTransaction, getTransactions, type TransactionQuery } from './endpoints'

export const transactionKeys = {
  lists: () => ['transactions', 'list'] as const,
  list: (query: TransactionQuery) => [...transactionKeys.lists(), query] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
}

/**
 * A page of transactions. While a new page/filter loads, the previous results stay on screen
 * (`isPlaceholderData` is true) instead of flashing back to a skeleton.
 */
export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: transactionKeys.list(query),
    queryFn: ({ signal }) => getTransactions(query, { signal }),
    placeholderData: keepPreviousData,
  })
}

/** A single transaction. Opening one from the list reuses the row we already have instead of refetching. */
export function useTransaction(id: string | null) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: transactionKeys.detail(id ?? ''),
    queryFn: ({ signal }) => getTransaction(id!, { signal }).then((res) => res.data),
    enabled: id !== null,
    initialData: () => {
      const pages = queryClient.getQueriesData<ApiSuccess<Transaction[]>>({
        queryKey: transactionKeys.lists(),
      })
      for (const [, page] of pages) {
        const match = page?.data.find((tx) => tx.id === id)
        if (match) return match
      }
      return undefined
    },
  })
}
