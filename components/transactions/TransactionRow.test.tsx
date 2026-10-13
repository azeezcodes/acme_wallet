import { render, screen } from '@testing-library/react'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const tx: Transaction = {
  id: 'txn_1',
  reference: 'ACM-1',
  type: 'bill_payment',
  status: 'pending',
  currency: 'USD',
  amount: 4599,
  fee: 50,
  narration: 'Bill payment - Spectranet <img src="x" onerror="alert(1)">',
  counterparty: null,
  createdAt: '2026-10-05T10:15:00.000Z',
}

describe('TransactionRow', () => {
  it('renders narration as text, never as HTML', () => {
    const { container } = render(<TransactionRow transaction={tx} />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText(tx.narration)).toBeInTheDocument()
  })

  it('signs debits and credits and shows the status', () => {
    const { rerender } = render(<TransactionRow transaction={tx} />)
    expect(screen.getByText('-$45.99')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()

    rerender(<TransactionRow transaction={{ ...tx, type: 'deposit' }} />)
    expect(screen.getByText('+$45.99')).toBeInTheDocument()
  })

  it('shows counterparty initials for transfers', () => {
    render(<TransactionRow transaction={{ ...tx, type: 'transfer_in', counterparty: 'Ada Okafor' }} />)
    expect(screen.getByText('AO')).toBeInTheDocument()
  })

  it('renders a link when given an href', () => {
    render(<TransactionRow transaction={tx} href="/transactions?tx=txn_1" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/transactions?tx=txn_1')
  })
})
