'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  buildTransactionsSearch,
  parseTransactionsSearch,
  type TransactionsSearchPatch,
} from './transactionsSearchParams'

interface NavigateOptions {
  /** Replace the current history entry instead of adding one. */
  replace?: boolean
  scroll?: boolean
}

/** The Transactions page state, read from and written to the URL so refresh, sharing and Back all work. */
export function useTransactionsSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const state = useMemo(() => parseTransactionsSearch(searchParams), [searchParams])

  const hrefFor = useCallback(
    (patch: TransactionsSearchPatch) => `${pathname}${buildTransactionsSearch(searchParams, patch)}`,
    [pathname, searchParams]
  )

  const navigate = useCallback(
    (patch: TransactionsSearchPatch, { replace = false, scroll = false }: NavigateOptions = {}) => {
      const href = hrefFor(patch)
      if (replace) router.replace(href, { scroll })
      else router.push(href, { scroll })
    },
    [hrefFor, router]
  )

  return { state, hrefFor, navigate }
}
