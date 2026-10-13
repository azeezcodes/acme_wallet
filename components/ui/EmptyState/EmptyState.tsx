import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: IconName
  title: string
  description?: ReactNode
  action?: ReactNode
  tone?: 'primary' | 'danger'
  /** Use "alert" for errors so screen readers announce them. */
  role?: 'status' | 'alert'
  className?: string
}

/** Centred icon, message and optional action. For empty, no-results, error and not-found states. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'primary',
  role = 'status',
  className,
}: EmptyStateProps) {
  return (
    <div className={cx(styles.root, className)} role={role}>
      <span className={cx(styles.icon, styles[tone])}>
        <Icon name={icon} size={20} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
