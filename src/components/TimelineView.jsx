import { liveOpsAgent } from '../agents/liveOpsAgent'

const STATUS_ICON = { 완료: '✓', 진행중: '▶', 대기: '⏸' }

export default function TimelineView({ timeline, onUpdate }) {
  const currentIdx = liveOpsAgent.getCurrentTimelineIndex(timeline)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {timeline.map((item, i) => {
        const status = item.status || '대기'
        const isActive = status === '진행중'
        const isDone = status === '완료'

        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
            background: isDone ? 'rgba(34,197,94,0.1)' : isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : isActive ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: isActive ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0, color: isDone ? '#4ade80' : isActive ? '#60a5fa' : '#475569' }}>
              {STATUS_ICON[status]}
            </span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b', width: 110, flexShrink: 0 }}>{item.time}</span>
            <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isDone ? '#86efac' : isActive ? '#bfdbfe' : '#94a3b8', flex: 1 }}>
              {item.title}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['대기', '진행중', '완료'].map((s) => (
                <button key={s} onClick={() => onUpdate(i, s)}
                  style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1px solid ${status === s ? (s === '완료' ? '#4ade80' : s === '진행중' ? '#60a5fa' : '#64748b') : 'rgba(255,255,255,0.15)'}`,
                    background: status === s ? (s === '완료' ? 'rgba(34,197,94,0.2)' : s === '진행중' ? 'rgba(59,130,246,0.2)' : 'rgba(100,116,139,0.2)') : 'transparent',
                    color: status === s ? (s === '완료' ? '#4ade80' : s === '진행중' ? '#60a5fa' : '#94a3b8') : '#475569',
                    fontWeight: status === s ? 600 : 400
                  }}>{s}</button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
