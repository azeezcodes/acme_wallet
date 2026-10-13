import { useId } from 'react'
import type { Transaction } from '@/types/api'
import { Skeleton } from '@/components/ui'
import { formatRelativeDay, localDayKey } from '@/lib/format'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionList.module.css'

interface DayGroup {
  key: string
  label: string
  transactions: Transaction[]
}

/** Split a newest-first list into consecutive days, in the viewer's time zone. */
export function groupByDay(transactions: readonly Transaction[], now = new Date()): DayGroup[] {
  const groups: DayGroup[] = []
  for (const tx of transactions) {
    const key = localDayKey(new Date(tx.createdAt))
    const last = groups.at(-1)
    if (last?.key === key) last.transactions.push(tx)
    else groups.push({ key, label: formatRelativeDay(tx.createdAt, now), transactions: [tx] })
  }
  return groups
}

export interface TransactionListProps {
  transactions: readonly Transaction[]
  getHref: (transaction: Transaction) => string
  onSelect?: (transaction: Transaction) => void
}

export function TransactionList({ transactions, getHref, onSelect }: TransactionListProps) {
  const id = useId()

  return (
    <div className={styles.list}>
      {groupByDay(transactions).map((group) => (
        <section key={group.key} aria-labelledby={`${id}-${group.key}`}>
          <h2 id={`${id}-${group.key}`} className={styles.day}>
            {group.label}
          </h2>
          <ul className={styles.rows}>
            {group.transactions.map((tx) => (
              <li key={tx.id}>
                <TransactionRow transaction={tx} href={getHref(tx)} onSelect={onSelect} timeOnly />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

const SKELETON_ROWS = 6

export function TransactionListSkeleton() {
  return (
    <div className={styles.list} aria-hidden>
      <div className={styles.day}>
        <Skeleton width={64} height={10} />
      </div>
      <ul className={styles.rows}>
        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
          <li key={i} className={styles.skeletonRow}>
            <Skeleton circle width={40} height={40} />
            <span className={styles.skeletonMain}>
              <Skeleton width="40%" height={12} />
              <Skeleton width="65%" height={10} />
            </span>
            <span className={styles.skeletonEnd}>
              <Skeleton width={80} height={12} />
              <Skeleton width={40} height={10} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
