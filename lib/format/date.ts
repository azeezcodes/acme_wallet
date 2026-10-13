const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

const dateTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** "Wed, 30 Sep 2026" */
export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

/** "14:22" */
export const formatTime = (iso: string) => timeFormatter.format(new Date(iso))

/** "Wed, 30 Sep 2026, 14:22" */
export const formatDateTime = (iso: string) => dateTimeFormatter.format(new Date(iso))

/** Calendar day in the viewer's time zone, e.g. "2026-10-05". Use as a grouping key. */
export function localDayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** "Today", "Yesterday" or "Mon, 5 Oct 2026", in the viewer's time zone. */
export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)

  if (localDayKey(date) === localDayKey(now)) return 'Today'
  if (localDayKey(date) === localDayKey(yesterday)) return 'Yesterday'
  return formatDate(iso)
}
