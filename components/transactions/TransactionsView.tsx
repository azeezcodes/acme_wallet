'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import type { Transaction, TransactionStatus, TransactionType } from '@/types/api'
import { Button, Card, EmptyState, Pagination } from '@/components/ui'
import { cx } from '@/lib/cx'
import { useTransactions } from '@/lib/api/queries'
import { TransactionDetailsDrawer } from './TransactionDetailsDrawer'
import { TransactionFilters } from './TransactionFilters'
import { TransactionList, TransactionListSkeleton } from './TransactionList'
import { hasActiveFilters } from './transactionsSearchParams'
import { useTransactionsSearch } from './useTransactionsSearch'
import styles from './TransactionsView.module.css'

export const PAGE_SIZE = 20

const plural = (count: number, word: string) =>
  `${count.toLocaleString('en-GB')} ${word}${count === 1 ? '' : 's'}`

export function TransactionsView() {
  const router = useRouter()
  const { state, hrefFor, navigate } = useTransactionsSearch()
  const isFiltered = hasActiveFilters(state)

  const { data, error, isPending, isPlaceholderData, refetch, isRefetching } = useTransactions({
    page: state.page,
    limit: PAGE_SIZE,
    q: state.q || undefined,
    type: state.type,
    status: state.status,
  })

  const meta = data?.meta
  const transactions = data?.data ?? []

  // A shared or stale link can point past the last page (e.g. ?page=40 after filtering). Snap to the last one.
  useEffect(() => {
    if (meta && meta.total > 0 && state.page > meta.totalPages) {
      navigate({ page: meta.totalPages }, { replace: true })
    }
  }, [meta, state.page, navigate])

  // Closing the drawer should undo opening it. If it was opened here, go Back so history doesn't grow;
  // if the page was loaded with it open (a shared link), just remove it from the URL.
  const [openedInApp, setOpenedInApp] = useState(false)
  const [previousTx, setPreviousTx] = useState(state.tx)
  if (state.tx !== previousTx) {
    setPreviousTx(state.tx)
    setOpenedInApp(previousTx === null)
  }

  const closeDetails = useCallback(() => {
    if (openedInApp) router.back()
    else navigate({ tx: null }, { replace: true })
  }, [openedInApp, router, navigate])

  // Filters reset to page 1. Starting a search adds a history entry; refining it replaces that entry,
  // so Back returns to the pre-search list instead of stepping through keystrokes.
  const isSearching = state.q !== ''
  const onSearchChange = useCallback(
    (q: string) => navigate({ q, page: null }, { replace: isSearching }),
    [navigate, isSearching]
  )
  const onTypeChange = useCallback(
    (type: TransactionType | undefined) => navigate({ type, page: null }),
    [navigate]
  )
  const onStatusChange = useCallback(
    (status: TransactionStatus | undefined) => navigate({ status, page: null }),
    [navigate]
  )
  const clearFilters = useCallback(
    () => navigate({ q: null, type: null, status: null, page: null }),
    [navigate]
  )

  const getRowHref = useCallback((tx: Transaction) => hrefFor({ tx: tx.id }), [hrefFor])
  const getPageHref = useCallback((page: number) => hrefFor({ page }), [hrefFor])

  let subtitle: string | null = null
  if (meta) subtitle = isFiltered ? plural(meta.total, 'result') : plural(meta.total, 'transaction')

  let content
  if (isPending) {
    content = <TransactionListSkeleton />
  } else if (error && !data) {
    content = (
      <EmptyState
        icon="alert"
        tone="danger"
        role="alert"
        title="We couldn't load your transactions"
        description="Check your connection and try again."
        action={
          <Button iconLeft="refresh" onClick={() => refetch()} disabled={isRefetching}>
            Try again
          </Button>
        }
      />
    )
  } else if (transactions.length === 0 && isFiltered) {
    content = (
      <EmptyState
        icon="search"
        title="No transactions match your filters"
        description="Try a different search term or remove some filters."
        action={
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        }
      />
    )
  } else if (transactions.length === 0) {
    content = (
      <EmptyState
        icon="inbox"
        title="No transactions yet"
        description="When you add money, send a transfer or pay with your card, it will show up here."
      />
    )
  } else {
    content = <TransactionList transactions={transactions} getHref={getRowHref} />
  }

  const showPagination = meta && transactions.length > 0
  const firstItem = meta ? (meta.page - 1) * meta.limit + 1 : 0
  const lastItem = meta ? firstItem + transactions.length - 1 : 0

  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Transactions</h1>
        <p className={styles.subtitle} role="status">
          {subtitle ?? <span className="visually-hidden">Loading transactions</span>}
        </p>
      </header>

      <TransactionFilters
        q={state.q}
        type={state.type}
        status={state.status}
        onSearchChange={onSearchChange}
        onTypeChange={onTypeChange}
        onStatusChange={onStatusChange}
        onClear={clearFilters}
      />

      <Card padding="none">
        <div
          className={cx(styles.results, isPlaceholderData && styles.stale)}
          aria-busy={isPending || isPlaceholderData}
        >
          {content}
        </div>
      </Card>

      {showPagination && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          getHref={getPageHref}
          summary={`Showing ${firstItem.toLocaleString('en-GB')}–${lastItem.toLocaleString('en-GB')} of ${meta.total.toLocaleString('en-GB')}`}
        />
      )}

      <TransactionDetailsDrawer transactionId={state.tx} onClose={closeDetails} />
    </div>
  )
}
