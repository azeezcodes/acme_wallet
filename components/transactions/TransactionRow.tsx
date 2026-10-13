import Link from 'next/link'
import type { ReactNode } from 'react'
import type { Transaction } from '@/types/api'
import { Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { formatDateTime, formatTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  /** Link to the transaction's details. `onSelect` still fires when it is followed. */
  href?: string
  onSelect?: (transaction: Transaction) => void
  /** Show only the time, for lists that are already grouped by day. */
  timeOnly?: boolean
}

export function TransactionRow({ transaction: tx, href, onSelect, timeOnly = false }: TransactionRowProps) {
  const credit = isCredit(tx.type)

  const content: ReactNode = (
    <>
      <TransactionAvatar transaction={tx} className={styles.avatar} />
      <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
      {/* Narration comes from upstream providers unsanitised: always render it as text. */}
      <span className={styles.narration}>{tx.narration}</span>
      <StatusBadge status={tx.status} className={styles.status} />
      <Money
        amount={tx.amount}
        currency={tx.currency}
        sign={credit ? 'credit' : 'debit'}
        className={cx(styles.amount, credit && styles.credit)}
      />
      <time className={styles.time} dateTime={tx.createdAt}>
        {timeOnly ? formatTime(tx.createdAt) : formatDateTime(tx.createdAt)}
      </time>
    </>
  )

  if (href) {
    return (
      <Link href={href} scroll={false} className={styles.row} onClick={() => onSelect?.(tx)}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={styles.row} onClick={() => onSelect?.(tx)}>
      {content}
    </button>
  )
}
