import { differenceInCalendarDays, parseISO, isValid } from 'date-fns'

export function validateSessions(sessions) {
  const errors = []
  const sorted = [...sessions]
    .filter((s) => s.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    const diff = differenceInCalendarDays(parseISO(curr.date), parseISO(prev.date))
    if (diff < 3) {
      errors.push({
        type: 'interval',
        sessions: [prev.sessionNumber, curr.sessionNumber],
        message: `${prev.sessionNumber}차와 ${curr.sessionNumber}차 간격이 ${diff}일로 3일 미만입니다.`,
      })
    }
  }

  sessions.forEach((s) => {
    if (s.startTime && s.endTime && s.startTime >= s.endTime) {
      errors.push({
        type: 'time',
        session: s.sessionNumber,
        message: `${s.sessionNumber}차 종료시간이 시작시간보다 빠르거나 같습니다.`,
      })
    }
  })

  return errors
}

export function isD3Overdue(dateStr) {
  if (!dateStr) return false
  const target = parseISO(dateStr)
  if (!isValid(target)) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = differenceInCalendarDays(target, today)
  return diff <= 3 && diff >= 0
}
