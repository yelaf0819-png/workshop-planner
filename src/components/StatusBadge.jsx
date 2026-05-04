const STATUS_STYLES = {
  준비중: 'bg-gray-100 text-gray-600',
  진행중: 'bg-blue-100 text-blue-700',
  완료: 'bg-green-100 text-green-700',
  취소: 'bg-red-100 text-red-500',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || STATUS_STYLES['준비중']}`}>
      {status}
    </span>
  )
}
