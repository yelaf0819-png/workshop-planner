import { calcDday, formatDday } from '../utils/dday'

const statusColor = { 준비중: '#64748b', 진행중: '#3b82f6', 완료: '#22c55e', 취소: '#ef4444' }
const statusBg = { 준비중: '#f1f5f9', 진행중: '#eff6ff', 완료: '#f0fdf4', 취소: '#fef2f2' }

export default function OperationTable({ project }) {
  if (!project) return null
  return (
    <div id="operation-table" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{project.name}</h2>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>
          담당: {project.manager || '-'} · 총 {project.sessions.length}차수 · 유형: {project.type || '-'}
          {project.commonSettings?.reportDeadline && ` · 보고 마감: ${project.commonSettings.reportDeadline}`}
        </p>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['차수', '날짜', '시간', '장소', '인원', '방식', '도구', '퍼실', 'D-day', '상태'].map((h) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 500, borderBottom: '1px solid #e8ecf0', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {project.sessions.map((s) => {
              const ddays = calcDday(s.date)
              const ddayLabel = formatDday(ddays)
              return (
                <tr key={s.sessionNumber} style={{ borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                      {s.sessionNumber}차
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>{s.date || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap' }}>{s.startTime || '-'}{s.endTime ? `~${s.endTime}` : ''}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{s.venue || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#374151', textAlign: 'center' }}>{s.expectedParticipants || '-'}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.mode || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {(s.tools || []).map((t) => (
                        <span key={t} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 11, padding: '1px 7px', borderRadius: 20 }}>{t}</span>
                      ))}
                      {(!s.tools || s.tools.length === 0) && <span style={{ color: '#cbd5e1' }}>-</span>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.facilitator || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {ddayLabel && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: ddays === 0 ? '#ef4444' : ddays <= 3 ? '#fff7ed' : '#eff6ff',
                        color: ddays === 0 ? '#fff' : ddays <= 3 ? '#ea580c' : '#3b82f6'
                      }}>{ddayLabel}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: statusBg[s.status], color: statusColor[s.status] }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
