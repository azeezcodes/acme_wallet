export type PageItem = number | 'ellipsis'

/**
 * Page numbers to show: first, last, the current page and its neighbours, with gaps collapsed to an ellipsis.
 * getPageItems(1, 12) -> [1, 2, 3, 'ellipsis', 12]
 * getPageItems(6, 12) -> [1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]
 */
export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  // Keep the row a steady width near either end.
  if (page <= 3) pages.add(2).add(3)
  if (page >= totalPages - 2) pages.add(totalPages - 1).add(totalPages - 2)

  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items: PageItem[] = []
  sorted.forEach((p, i) => {
    const previous = sorted[i - 1]
    if (previous !== undefined) {
      // A single missing page is shown rather than hidden behind an ellipsis.
      if (p - previous === 2) items.push(previous + 1)
      else if (p - previous > 2) items.push('ellipsis')
    }
    items.push(p)
  })
  return items
}
