import { calcDday, formatDday } from '../utils/dday'

export default function DDayBadge({ date, highlight = false }) {
  const days = calcDday(date)
  const label = formatDday(days)
  if (!label) return null

  let color = 'bg-gray-100 text-gray-500'
  if (days !== null) {
    if (days === 0) color = 'bg-red-500 text-white'
    else if (days <= 3) color = 'bg-orange-100 text-orange-700'
    else if (days <= 7) color = 'bg-yellow-100 text-yellow-700'
    else if (days < 0) color = 'bg-gray-200 text-gray-400'
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color} ${highlight ? 'ring-2 ring-offset-1 ring-orange-400' : ''}`}>
      {label}
    </span>
  )
}
