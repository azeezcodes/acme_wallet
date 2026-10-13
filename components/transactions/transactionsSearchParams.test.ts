import { buildTransactionsSearch, parseTransactionsSearch } from './transactionsSearchParams'

const parse = (query: string) => parseTransactionsSearch(new URLSearchParams(query))

describe('parseTransactionsSearch', () => {
  it('reads valid params', () => {
    expect(parse('q=netflix&type=card_payment&status=failed&page=3&tx=txn_1')).toEqual({
      q: 'netflix',
      type: 'card_payment',
      status: 'failed',
      page: 3,
      tx: 'txn_1',
    })
  })

  it('falls back to defaults for invalid values', () => {
    expect(parse('type=refund&status=reversed&page=-2&q=%20%20')).toEqual({
      q: '',
      type: undefined,
      status: undefined,
      page: 1,
      tx: null,
    })
    expect(parse('page=1.5').page).toBe(1)
    expect(parse('type=toString').type).toBeUndefined()
  })
})

describe('buildTransactionsSearch', () => {
  const current = new URLSearchParams('q=net&page=3&__scenario=slow')

  it('patches params and keeps unrelated ones', () => {
    expect(buildTransactionsSearch(current, { status: 'pending', page: null })).toBe(
      '?q=net&__scenario=slow&status=pending'
    )
  })

  it('drops defaults', () => {
    expect(buildTransactionsSearch(current, { q: '', page: 1 })).toBe('?__scenario=slow')
    expect(buildTransactionsSearch(new URLSearchParams(), { page: 1 })).toBe('')
  })
})
