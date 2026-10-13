import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Card } from '@/components/ui'
import { TransactionListSkeleton, TransactionsView } from '@/components/transactions'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  // The view reads its state from the URL (useSearchParams), so it renders on the client.
  return (
    <Suspense fallback={<TransactionsFallback />}>
      <TransactionsView />
    </Suspense>
  )
}

function TransactionsFallback() {
  return (
    <div className={styles.fallback}>
      <h1 className={styles.title}>Transactions</h1>
      <Card padding="none">
        <TransactionListSkeleton />
      </Card>
    </div>
  )
}
