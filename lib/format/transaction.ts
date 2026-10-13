import type { Transaction, TransactionStatus, TransactionType } from '@/types/api'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  conversion: 'Conversion',
  card_payment: 'Card payment',
  bill_payment: 'Bill payment',
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
}

/**
 * Money coming into the wallet. A conversion row is recorded in the currency that was received, so it is a
 * credit to that wallet (the debit side lives in the source wallet and isn't a separate row).
 */
const CREDIT_TYPES: ReadonlySet<TransactionType> = new Set(['deposit', 'transfer_in', 'conversion'])

export const isCredit = (type: TransactionType) => CREDIT_TYPES.has(type)

/** "Ada Okafor" -> "AO", "Okonkwo-Adeyemi Logistics" -> "OA". */
export function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

/** One-line summary for the details view, e.g. "Transfer out to Kwame Mensah". */
export function describeTransaction(tx: Pick<Transaction, 'type' | 'counterparty' | 'narration'>): string {
  if (!tx.counterparty) return tx.narration
  const preposition = isCredit(tx.type) ? 'from' : 'to'
  return `${TRANSACTION_TYPE_LABELS[tx.type]} ${preposition} ${tx.counterparty}`
}
