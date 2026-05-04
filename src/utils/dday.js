import { differenceInCalendarDays, parseISO, isValid } from 'date-fns'

export function calcDday(dateStr) {
  if (!dateStr) return null
  const target = parseISO(dateStr)
  if (!isValid(target)) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return differenceInCalendarDays(target, today)
}

export function formatDday(days) {
  if (days === null) return ''
  if (days === 0) return 'D-Day'
  if (days > 0) return `D-${days}`
  return `D+${Math.abs(days)}`
}

export function getNextSession(sessions) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return sessions
    .filter((s) => s.date && s.status !== '완료' && s.status !== '취소')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .find((s) => new Date(s.date) >= today) || null
}
