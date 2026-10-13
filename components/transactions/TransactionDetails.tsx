import { useId } from 'react'
import type { Transaction } from '@/types/api'
import { CopyButton, Money, Skeleton } from '@/components/ui'
import { cx } from '@/lib/cx'
import { describeTransaction, formatDateTime, isCredit, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusBadge } from './StatusBadge'
import { TransactionAvatar } from './TransactionAvatar'
import styles from './TransactionDetails.module.css'

export function TransactionDetails({ transaction: tx }: { transaction: Transaction }) {
  const credit = isCredit(tx.type)
  const id = useId()

  return (
    <div className={styles.root}>
      <div className={styles.hero}>
        <TransactionAvatar transaction={tx} size="lg" />
        <p className={styles.description}>{describeTransaction(tx)}</p>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={credit ? 'credit' : 'debit'}
          className={cx(styles.amount, credit && styles.credit)}
        />
        <StatusBadge status={tx.status} />
      </div>

      <section className={styles.section} aria-labelledby={`${id}-details`}>
        <h3 id={`${id}-details`} className={styles.heading}>
          Details
        </h3>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt>Reference</dt>
            <dd className={styles.reference}>
              <span className={styles.mono}>{tx.reference}</span>
              <CopyButton value={tx.reference} label="reference" />
            </dd>
          </div>
          <div className={styles.item}>
            <dt>Date</dt>
            <dd>
              <time dateTime={tx.createdAt}>{formatDateTime(tx.createdAt)}</time>
            </dd>
          </div>
          <div className={styles.item}>
            <dt>Type</dt>
            <dd>{TRANSACTION_TYPE_LABELS[tx.type]}</dd>
          </div>
          {tx.counterparty && (
            <div className={styles.item}>
              <dt>Counterparty</dt>
              <dd>{tx.counterparty}</dd>
            </div>
          )}
          <div className={styles.item}>
            <dt>Narration</dt>
            <dd>{tx.narration}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section} aria-labelledby={`${id}-summary`}>
        <h3 id={`${id}-summary`} className={styles.heading}>
          Summary
        </h3>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt>Amount</dt>
            <dd>
              <Money amount={tx.amount} currency={tx.currency} />
            </dd>
          </div>
          <div className={styles.item}>
            <dt>Fee</dt>
            <dd>
              <Money amount={tx.fee} currency={tx.currency} />
            </dd>
          </div>
          <div className={cx(styles.item, styles.total)}>
            <dt>Total</dt>
            <dd>
              {/* API.md: the fee is charged on top of the amount, in the same currency. */}
              <Money amount={tx.amount + tx.fee} currency={tx.currency} />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export function TransactionDetailsSkeleton() {
  return (
    <div className={styles.root} aria-busy="true" aria-label="Loading transaction">
      <div className={styles.hero}>
        <Skeleton circle width={56} height={56} />
        <Skeleton width={180} height={12} />
        <Skeleton width={200} height={28} />
        <Skeleton width={84} height={22} />
      </div>
      <div className={styles.list}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={styles.item}>
            <Skeleton width={72} />
            <Skeleton width={120} />
          </div>
        ))}
      </div>
    </div>
  )
}
