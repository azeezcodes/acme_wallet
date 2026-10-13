import type { CSSProperties } from 'react'
import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'

export interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  circle?: boolean
  className?: string
}

/** Placeholder block for content that is loading. Decorative: announce loading on the container instead. */
export function Skeleton({ width, height = 12, circle = false, className }: SkeletonProps) {
  return (
    <span
      className={cx(styles.skeleton, circle && styles.circle, className)}
      style={{ width, height }}
      aria-hidden
    />
  )
}
