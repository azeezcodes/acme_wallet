import Link from 'next/link'
import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon } from '../Icon'
import { getPageItems } from './getPageItems'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  /** Pages are links, so they can be opened in a new tab and work with Back. */
  getHref: (page: number) => string
  /** Shown at the start on wide screens, e.g. "Showing 1–20 of 237". */
  summary?: ReactNode
  className?: string
}

export function Pagination({ page, totalPages, getHref, summary, className }: PaginationProps) {
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  return (
    <nav className={cx(styles.root, className)} aria-label="Pagination">
      {summary && <p className={styles.summary}>{summary}</p>}
      <div className={styles.controls}>
        <StepLink href={hasPrevious ? getHref(page - 1) : null} direction="previous" />

        <ol className={styles.pages}>
          {getPageItems(page, totalPages).map((item, index) =>
            item === 'ellipsis' ? (
              <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden>
                …
              </li>
            ) : (
              <li key={item}>
                <Link
                  href={getHref(item)}
                  className={cx(styles.page, item === page && styles.current)}
                  aria-current={item === page ? 'page' : undefined}
                  aria-label={`Page ${item}`}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ol>

        <p className={styles.compact}>
          Page {page} of {totalPages}
        </p>

        <StepLink href={hasNext ? getHref(page + 1) : null} direction="next" />
      </div>
    </nav>
  )
}

function StepLink({ href, direction }: { href: string | null; direction: 'previous' | 'next' }) {
  const isPrevious = direction === 'previous'
  const content = (
    <>
      {isPrevious && <Icon name="chevron-left" size={16} />}
      <span className={styles.stepFull}>{isPrevious ? 'Previous' : 'Next'}</span>
      <span className={styles.stepShort}>{isPrevious ? 'Prev' : 'Next'}</span>
      {!isPrevious && <Icon name="chevron-right" size={16} />}
    </>
  )

  if (!href) {
    // A link without an href isn't focusable; aria-disabled keeps it discoverable as "unavailable".
    return (
      <a className={cx(styles.step, styles.disabled)} aria-disabled="true" role="link">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={styles.step} rel={isPrevious ? 'prev' : 'next'}>
      {content}
    </Link>
  )
}
