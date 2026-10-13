'use client'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Icon } from '../Icon'
import styles from './Drawer.module.css'

export interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

/**
 * Side panel on wide screens, bottom sheet on narrow ones.
 *
 * Built on a modal <dialog>, which gives us focus trapping, Escape to close, an inert page behind it and
 * focus restoration for free.
 */
export function Drawer({ open, title, onClose, children, footer }: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  // The dialog can also close itself (e.g. a second Escape press); only report closes the parent didn't ask for.
  const openRef = useRef(open)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    openRef.current = open
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.panel}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={() => {
        if (openRef.current) onCloseRef.current()
      }}
      onClick={(event) => {
        // The panel content fills the dialog, so a click on the dialog itself is a click on the backdrop.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </dialog>
  )
}
