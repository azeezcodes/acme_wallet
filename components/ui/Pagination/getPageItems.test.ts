import { getPageItems } from './getPageItems'

describe('getPageItems', () => {
  it('lists every page when there are few', () => {
    expect(getPageItems(1, 1)).toEqual([1])
    expect(getPageItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('collapses distant pages', () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, 'ellipsis', 12])
    expect(getPageItems(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12])
    expect(getPageItems(12, 12)).toEqual([1, 'ellipsis', 10, 11, 12])
  })

  it('shows a single hidden page instead of an ellipsis', () => {
    expect(getPageItems(4, 12)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 12])
  })
})
