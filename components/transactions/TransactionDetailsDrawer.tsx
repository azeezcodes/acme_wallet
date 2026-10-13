'use client'
import { Button, Drawer, EmptyState } from '@/components/ui'
import { ApiError } from '@/lib/api/client'
import { useTransaction } from '@/lib/api/queries'
import { TransactionDetails, TransactionDetailsSkeleton } from './TransactionDetails'

export interface TransactionDetailsDrawerProps {
  /** The transaction to show, or null when the drawer is closed. */
  transactionId: string | null
  onClose: () => void
}

export function TransactionDetailsDrawer({ transactionId, onClose }: TransactionDetailsDrawerProps) {
  return (
    <Drawer open={transactionId !== null} title="Transaction details" onClose={onClose}>
      {transactionId !== null && <DrawerContent id={transactionId} onClose={onClose} />}
    </Drawer>
  )
}

function DrawerContent({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, error, isPending, refetch, isRefetching } = useTransaction(id)

  if (data) return <TransactionDetails transaction={data} />
  if (isPending) return <TransactionDetailsSkeleton />

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon="search"
        title="Transaction not found"
        description="It may have been removed, or the link is wrong."
        action={
          <Button variant="secondary" size="sm" onClick={onClose}>
            Back to transactions
          </Button>
        }
      />
    )
  }

  return (
    <EmptyState
      icon="alert"
      tone="danger"
      role="alert"
      title="We couldn't load this transaction"
      description="Check your connection and try again."
      action={
        <Button size="sm" iconLeft="refresh" onClick={() => refetch()} disabled={isRefetching}>
          Try again
        </Button>
      }
    />
  )
}
