import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import Layout from '../components/Layout'
import { calcDday, formatDday } from '../utils/dday'
import { summaryAgent } from '../agents/summaryAgent'

const statusColor = { 준비중: '#64748b', 진행중: '#3b82f6', 완료: '#22c55e', 취소: '#ef4444' }
const statusBg = { 준비중: '#f1f5f9', 진행중: '#eff6ff', 완료: '#f0fdf4', 취소: '#fef2f2' }

export default function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects } = useWorkshopStore()
  const project = projects.find((p) => p.id === projectId)

  if (!project) { navigate('/'); return null }

  const completed = project.sessions.filter((s) => s.status === '완료').length
  const allComplete = summaryAgent.isProjectComplete(project)
  const percent = project.sessions.length > 0 ? Math.round((completed / project.sessions.length) * 100) : 0

  const steps = [
    { label: '프로젝트 확정', path: `/create`, done: true },
    { label: '기간·요소 입력', path: `/session-input/${projectId}`, done: project.sessions.some((s) => s.date) },
    { label: '운영판 생성', path: `/sheet/${projectId}`, done: true },
    { label: '사전 체크업', path: `/precheck/${projectId}`, done: completed > 0 },
    { label: '당일 운영', path: null, done: project.sessions.some((s) => s.liveNotes?.length > 0) },
    { label: '결과 요약', path: `/retrospective/${projectId}`, done: !!project.retrospective?.completedAt },
  ]

  return (
    <Layout
      title={project.name}
      subtitle={`${project.client || ''} · ${project.manager || ''} · ${project.type || ''}`}
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate(`/sheet/${projectId}`)} style={{ border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#3b82f6', background: '#eff6ff', cursor: 'pointer' }}>운영판 보기</button>
          <button onClick={() => navigate(`/precheck/${projectId}`)} style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#fff', fontWeight: 600, cursor: 'pointer' }}>사전 체크업</button>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, maxWidth: 900 }}>
        {/* 왼쪽 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* 진행률 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>전체 진행률</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{percent}%</span>
            </div>
            <div style={{ width: '100%', background: '#f1f5f9', borderRadius: 999, height: 8 }}>
              <div style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #3b82f6, #6366f1)', height: 8, borderRadius: 999, transition: 'width 0.5s' }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>{project.sessions.length}차수 중 {completed}차수 완료</div>
          </div>

          {/* 차수 목록 */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>차수 현황</span>
            </div>
            {project.sessions.map((s) => {
              const ddays = calcDday(s.date)
              return (
                <div key={s.sessionNumber} style={{ padding: '12px 20px', borderBottom: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700
                    }}>{s.sessionNumber}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{s.date || '날짜 미정'} {s.startTime}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.venue || '장소 미정'} · {s.facilitator || '퍼실 미정'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {ddays !== null && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                        background: ddays === 0 ? '#ef4444' : ddays <= 3 ? '#fff7ed' : '#eff6ff',
                        color: ddays === 0 ? '#fff' : ddays <= 3 ? '#ea580c' : '#3b82f6'
                      }}>{formatDday(ddays)}</span>
                    )}
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: statusBg[s.status], color: statusColor[s.status], fontWeight: 500 }}>{s.status}</span>
                    <button onClick={() => navigate(`/live/${projectId}/${s.sessionNumber}`)}
                      style={{ fontSize: 11, color: '#3b82f6', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px', cursor: 'pointer' }}>
                      운영
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {allComplete && (
            <button onClick={() => navigate(`/retrospective/${projectId}`)}
              style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              결과 요약 및 회고 작성하기 →
            </button>
          )}
        </div>

        {/* 오른쪽: 워크플로우 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', height: 'fit-content' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>워크플로우</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: step.done ? '#f0fdf4' : '#f8fafc' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                  background: step.done ? '#22c55e' : '#e2e8f0', color: step.done ? '#fff' : '#94a3b8'
                }}>{step.done ? '✓' : i + 1}</div>
                <span style={{ flex: 1, fontSize: 12, color: step.done ? '#16a34a' : '#64748b', fontWeight: step.done ? 500 : 400 }}>{step.label}</span>
                {step.path && (
                  <button onClick={() => navigate(step.path)}
                    style={{ fontSize: 11, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {step.done ? '수정' : '시작'} →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
