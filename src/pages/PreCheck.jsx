import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import Layout from '../components/Layout'
import { calcDday, formatDday } from '../utils/dday'
import { isD3Overdue } from '../utils/validateInterval'

const STATUS_OPTIONS = ['준비중', '진행중', '완료', '취소']
const statusColor = { 준비중: '#64748b', 진행중: '#3b82f6', 완료: '#22c55e', 취소: '#ef4444' }
const statusBg = { 준비중: '#f1f5f9', 진행중: '#eff6ff', 완료: '#f0fdf4', 취소: '#fef2f2' }

export default function PreCheck() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, updateSession, toggleChecklistItem } = useWorkshopStore()
  const project = projects.find((p) => p.id === projectId)

  if (!project) { navigate('/'); return null }

  const completed = project.sessions.filter((s) => s.status === '완료').length
  const allComplete = project.sessions.every((s) => s.status === '완료' || s.status === '취소')
  const total = project.sessions.length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <Layout title="사전 체크업" subtitle={project.name}>
      {/* 전체 현황 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', marginBottom: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>전체 진행 현황</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{total}차수 중 {completed}차수 완료 ({percent}%)</span>
        </div>
        <div style={{ width: '100%', background: '#f1f5f9', borderRadius: 999, height: 8 }}>
          <div style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)', height: 8, borderRadius: 999, transition: 'width 0.5s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 720 }}>
        {project.sessions.map((session) => {
          const isD3 = isD3Overdue(session.date)
          const ddays = calcDday(session.date)
          const incompleteCount = session.checklist?.filter((c) => !c.done).length || 0
          const checkDone = session.checklist?.filter((c) => c.done).length || 0
          const checkTotal = session.checklist?.length || 0

          return (
            <div key={session.sessionNumber} style={{
              background: '#fff', borderRadius: 12, border: `1px solid ${isD3 ? '#fed7aa' : '#e8ecf0'}`,
              overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              {/* 차수 헤더 */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700
                  }}>{session.sessionNumber}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{session.sessionNumber}차 워크숍</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{session.date} {session.startTime} · {session.venue || '장소 미정'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isD3 && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}>
                      D-3 경고
                    </span>
                  )}
                  {ddays !== null && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: ddays === 0 ? '#ef4444' : ddays <= 3 ? '#fff7ed' : '#eff6ff',
                      color: ddays === 0 ? '#fff' : ddays <= 3 ? '#ea580c' : '#3b82f6'
                    }}>{formatDday(ddays)}</span>
                  )}
                  <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: statusBg[session.status], color: statusColor[session.status] }}>
                    {session.status}
                  </span>
                </div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                {/* 상태 변경 */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 8 }}>상태 변경</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {STATUS_OPTIONS.map((s) => (
                      <button key={s} onClick={() => updateSession(projectId, session.sessionNumber, { status: s })}
                        style={{
                          padding: '5px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                          border: `1px solid ${session.status === s ? statusColor[s] : '#e2e8f0'}`,
                          background: session.status === s ? statusBg[s] : '#fff',
                          color: session.status === s ? statusColor[s] : '#94a3b8',
                          fontWeight: session.status === s ? 600 : 400
                        }}>{s}</button>
                    ))}
                  </div>
                </div>

                {/* 준비물 */}
                {checkTotal > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <label style={{ fontSize: 12, color: '#64748b' }}>준비물 체크리스트</label>
                      <span style={{ fontSize: 11, color: isD3 && incompleteCount > 0 ? '#ea580c' : '#94a3b8' }}>
                        {checkDone}/{checkTotal} 완료{isD3 && incompleteCount > 0 ? ` (${incompleteCount}개 미완료)` : ''}
                      </span>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px' }}>
                      {session.checklist.map((item) => (
                        <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', cursor: 'pointer' }}>
                          <input type="checkbox" checked={item.done}
                            onChange={() => toggleChecklistItem(projectId, session.sessionNumber, item.id)}
                            style={{ width: 15, height: 15, accentColor: '#3b82f6', cursor: 'pointer' }} />
                          <span style={{ fontSize: 13, color: item.done ? '#94a3b8' : isD3 && !item.done ? '#ea580c' : '#374151', textDecoration: item.done ? 'line-through' : 'none', flex: 1 }}>
                            {item.item}
                          </span>
                          {isD3 && !item.done && <span style={{ fontSize: 10, color: '#ea580c', fontWeight: 600 }}>미완료</span>}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* 공통 준비물 */}
                {project.commonSettings?.commonChecklist?.length > 0 && (
                  <div style={{ marginBottom: 12, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>공통 준비물</p>
                    {project.commonSettings.commonChecklist.map((item, i) => (
                      <p key={i} style={{ fontSize: 12, color: '#64748b', padding: '2px 0' }}>□ {item}</p>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>
                    퍼실: {session.facilitator || '미정'} · 도구: {(session.tools || []).join(', ') || '없음'}
                  </span>
                  <button onClick={() => navigate(`/live/${projectId}/${session.sessionNumber}`)}
                    style={{ fontSize: 12, color: '#3b82f6', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '5px 12px', cursor: 'pointer' }}>
                    당일 운영 →
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {allComplete && (
        <div style={{ marginTop: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '20px 24px', textAlign: 'center', maxWidth: 720 }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#16a34a', marginBottom: 12 }}>🎉 모든 차수가 완료되었습니다!</p>
          <button onClick={() => navigate(`/retrospective/${projectId}`)}
            style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            결과 요약 및 회고 작성하기 →
          </button>
        </div>
      )}
    </Layout>
  )
}
