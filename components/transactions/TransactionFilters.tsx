'use client'
import { useEffect, useState } from 'react'
import type { TransactionStatus, TransactionType } from '@/types/api'
import { Button, Input, Select, type SelectOption } from '@/components/ui'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import styles from './TransactionFilters.module.css'

const SEARCH_DEBOUNCE_MS = 300

const TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All types' },
  ...Object.entries(TRANSACTION_TYPE_LABELS).map(([value, label]) => ({ value, label })),
]

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  ...Object.entries(TRANSACTION_STATUS_LABELS).map(([value, label]) => ({ value, label })),
]

export interface TransactionFiltersProps {
  q: string
  type: TransactionType | undefined
  status: TransactionStatus | undefined
  onSearchChange: (q: string) => void
  onTypeChange: (type: TransactionType | undefined) => void
  onStatusChange: (status: TransactionStatus | undefined) => void
  onClear: () => void
}

export function TransactionFilters({
  q,
  type,
  status,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onClear,
}: TransactionFiltersProps) {
  // The input is local so typing stays instant; the URL (and the request) follow after a short pause.
  const [draft, setDraft] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)

  // The URL can change without typing (Back, "Clear filters"): mirror it into the input.
  if (q !== syncedQ) {
    setSyncedQ(q)
    if (q !== draft.trim()) setDraft(q)
  }

  useEffect(() => {
    const next = draft.trim()
    if (next === q) return
    const timer = setTimeout(() => onSearchChange(next), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [draft, q, onSearchChange])

  const isFiltered = Boolean(q || draft.trim() || type || status)

  return (
    <form
      className={styles.bar}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        if (draft.trim() !== q) onSearchChange(draft.trim())
      }}
    >
      <Input
        label="Search"
        type="search"
        leadingIcon="search"
        placeholder="Search by reference, name or narration"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        fieldClassName={styles.search}
        autoComplete="off"
        enterKeyHint="search"
      />
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={type ?? ''}
        onChange={(event) => onTypeChange((event.target.value || undefined) as TransactionType | undefined)}
        fieldClassName={styles.select}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={status ?? ''}
        onChange={(event) =>
          onStatusChange((event.target.value || undefined) as TransactionStatus | undefined)
        }
        fieldClassName={styles.select}
      />
      {isFiltered && (
        <Button
          variant="ghost"
          className={styles.clear}
          onClick={() => {
            setDraft('')
            onClear()
          }}
        >
          Clear filters
        </Button>
      )}
    </form>
  )
}
