import { describeTransaction, getInitials, isCredit } from './transaction'
import { formatRelativeDay } from './date'

describe('isCredit', () => {
  it('treats incoming money as credit', () => {
    expect(isCredit('deposit')).toBe(true)
    expect(isCredit('transfer_in')).toBe(true)
    expect(isCredit('conversion')).toBe(true)
    expect(isCredit('card_payment')).toBe(false)
    expect(isCredit('transfer_out')).toBe(false)
  })
})

describe('getInitials', () => {
  it('uses the first two words, splitting on hyphens', () => {
    expect(getInitials('Ada Okafor')).toBe('AO')
    expect(getInitials('Okonkwo-Adeyemi Logistics & Haulage International Ltd')).toBe('OA')
    expect(getInitials('kwame')).toBe('K')
  })
})

describe('describeTransaction', () => {
  it('names the counterparty when there is one', () => {
    expect(
      describeTransaction({
        type: 'transfer_out',
        counterparty: 'Kwame Mensah',
        narration: 'Transfer to Kwame',
      })
    ).toBe('Transfer out to Kwame Mensah')
    expect(
      describeTransaction({ type: 'transfer_in', counterparty: 'Ada Okafor', narration: 'Transfer from Ada' })
    ).toBe('Transfer in from Ada Okafor')
  })

  it('falls back to the narration', () => {
    expect(
      describeTransaction({ type: 'card_payment', counterparty: null, narration: 'Card payment - Netflix' })
    ).toBe('Card payment - Netflix')
  })
})

describe('formatRelativeDay', () => {
  const now = new Date(2026, 9, 13, 9, 0)

  it('labels today and yesterday in local time', () => {
    expect(formatRelativeDay(new Date(2026, 9, 13, 0, 5).toISOString(), now)).toBe('Today')
    expect(formatRelativeDay(new Date(2026, 9, 12, 23, 59).toISOString(), now)).toBe('Yesterday')
  })

  it('falls back to the full date', () => {
    expect(formatRelativeDay(new Date(2026, 9, 5, 10, 15).toISOString(), now)).toBe('Mon, 5 Oct 2026')
  })
})
