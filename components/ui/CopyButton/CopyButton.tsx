'use client'
import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import styles from './CopyButton.module.css'

export interface CopyButtonProps {
  value: string
  /** What is being copied, for the accessible name: "Copy reference". */
  label: string
}

const RESET_AFTER_MS = 2000

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), RESET_AFTER_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission). The value stays selectable.
    }
  }

  return (
    <>
      <button type="button" className={styles.button} onClick={copy} aria-label={`Copy ${label}`}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
      </button>
      <span className="visually-hidden" role="status">
        {copied ? 'Copied' : ''}
      </span>
    </>
  )
}
