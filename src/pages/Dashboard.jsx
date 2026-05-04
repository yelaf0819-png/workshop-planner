import { useNavigate } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import useTemplateStore from '../store/useTemplateStore'
import Layout from '../components/Layout'
import { getNextSession, calcDday, formatDday } from '../utils/dday'

const StatCard = ({ icon, iconBg, label, value, sub }) => (
  <div style={{
    background: '#fff', borderRadius: 12, padding: '20px 24px',
    border: '1px solid #e8ecf0', display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, background: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{sub}</div>}
    </div>
  </div>
)

const statusColor = { 준비중: '#64748b', 진행중: '#3b82f6', 완료: '#22c55e', 취소: '#ef4444' }
const statusBg = { 준비중: '#f1f5f9', 진행중: '#eff6ff', 완료: '#f0fdf4', 취소: '#fef2f2' }

export default function Dashboard() {
  const navigate = useNavigate()
  const { projects, deleteProject, cloneProject } = useWorkshopStore()
  const { templates } = useTemplateStore()

  const active = projects.filter((p) => !p.sessions.every((s) => s.status === '완료' || s.status === '취소'))
  const archived = projects.filter((p) => p.sessions.length > 0 && p.sessions.every((s) => s.status === '완료' || s.status === '취소'))
  const totalSessions = projects.reduce((s, p) => s + p.sessions.length, 0)
  const totalParticipants = projects.reduce((s, p) => s + p.sessions.reduce((ss, session) => ss + (parseInt(session.expectedParticipants) || 0), 0), 0)

  const handleClone = (projectId) => {
    const source = projects.find((p) => p.id === projectId)
    const name = prompt('새 프로젝트명을 입력하세요', `${source?.name} (복사)`)
    if (!name) return
    const newId = cloneProject(projectId, { name })
    if (newId) navigate(`/project/${newId}`)
  }

  // 이번 달 워크숍
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthSessions = projects.flatMap((p) =>
    p.sessions.filter((s) => {
      if (!s.date) return false
      const d = new Date(s.date)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    }).map((s) => ({ ...s, projectName: p.name, projectId: p.id, client: p.client }))
  ).sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <Layout
      title="대시보드"
      subtitle="전체 워크숍 현황을 한눈에 확인하세요"
      actions={
        <button onClick={() => navigate('/create')} style={{
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff',
          border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13,
          fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          + 새 프로젝트
        </button>
      }
    >
      {/* 통계 카드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard icon="🏢" iconBg="#eff6ff" label="총 프로젝트" value={projects.length} />
        <StatCard icon="📋" iconBg="#f0fdf4" label="총 차수" value={totalSessions} />
        <StatCard icon="👥" iconBg="#fdf4ff" label="총 예상 참여자" value={totalParticipants.toLocaleString()} />
        <StatCard icon="📁" iconBg="#fff7ed" label="저장된 템플릿" value={templates.length} sub="재활용 가능" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {/* 이번달 워크숍 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>이번달 워크숍</span>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 12, cursor: 'pointer' }}>전체보기 →</button>
          </div>
          <div style={{ padding: '0 4px' }}>
            {monthSessions.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>이번달 워크숍이 없습니다</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['회사', '워크숍명', '날짜', '상태'].map((h) => (
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthSessions.slice(0, 5).map((s, i) => {
                    const project = projects.find((p) => p.id === s.projectId)
                    return (
                      <tr key={i} onClick={() => navigate(`/project/${s.projectId}`)}
                        style={{ cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#475569' }}>{s.client || '-'}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 500, color: '#1e293b' }}>{s.projectName}</td>
                        <td style={{ padding: '10px 16px', fontSize: 12, color: '#64748b' }}>{s.date}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                            background: statusBg[s.status] || '#f1f5f9',
                            color: statusColor[s.status] || '#64748b'
                          }}>{s.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 진행 중 프로젝트 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>진행 중인 프로젝트</span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{active.length}개</span>
          </div>
          <div style={{ padding: '0 4px' }}>
            {active.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>진행 중인 프로젝트가 없습니다</div>
            ) : (
              active.slice(0, 4).map((p) => {
                const completed = p.sessions.filter((s) => s.status === '완료').length
                const next = getNextSession(p.sessions)
                const ddays = next ? calcDday(next.date) : null
                return (
                  <div key={p.id} onClick={() => navigate(`/project/${p.id}`)}
                    style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 13, color: '#1e293b', marginBottom: 3 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{p.client} · {completed}/{p.sessions.length}차수 완료</div>
                    </div>
                    {ddays !== null && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                        background: ddays === 0 ? '#ef4444' : ddays <= 3 ? '#fff7ed' : '#eff6ff',
                        color: ddays === 0 ? '#fff' : ddays <= 3 ? '#ea580c' : '#3b82f6'
                      }}>{formatDday(ddays)}</span>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* 빠른 작업 */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>빠른 작업</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { icon: '✏️', label: '새 프로젝트', desc: '처음부터 작성', onClick: () => navigate('/create'), color: '#eff6ff' },
            { icon: '📋', label: '템플릿 시작', desc: `${templates.length}개 템플릿`, onClick: () => navigate('/templates'), color: '#f5f3ff' },
            { icon: '📁', label: '프로젝트 복사', desc: `${projects.length}개 프로젝트`, onClick: () => projects.length > 0 ? handleClone(projects[0].id) : alert('복사할 프로젝트가 없습니다'), color: '#f0fdf4' },
            { icon: '📊', label: '운영판 보기', desc: '최근 프로젝트', onClick: () => projects.length > 0 ? navigate(`/sheet/${projects[projects.length-1].id}`) : alert('프로젝트가 없습니다'), color: '#fff7ed' },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} style={{
              background: item.color, border: '1px solid #e8ecf0', borderRadius: 10,
              padding: '18px 16px', cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 아카이브 */}
      {archived.length > 0 && (
        <div style={{ marginTop: 20, background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 600, color: '#64748b', fontSize: 15 }}>완료된 프로젝트 ({archived.length})</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['프로젝트명', '기관', '차수', '유형', '생성일', ''].map((h) => (
                  <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {archived.map((p) => (
                <tr key={p.id} onClick={() => navigate(`/project/${p.id}`)}
                  style={{ cursor: 'pointer', borderBottom: '1px solid #f8fafc' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{p.name}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b' }}>{p.client || '-'}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b' }}>{p.sessions.length}차수</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: '#64748b' }}>{p.type || '-'}</td>
                  <td style={{ padding: '11px 16px', fontSize: 12, color: '#94a3b8' }}>{p.createdAt}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleClone(p.id) }}
                      style={{ fontSize: 11, color: '#3b82f6', background: '#eff6ff', border: 'none', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
                      복사
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  )
}
