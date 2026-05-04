import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import useTemplateStore from '../store/useTemplateStore'
import Layout from '../components/Layout'
import { summaryAgent } from '../agents/summaryAgent'

export default function Retrospective() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, updateRetrospective, updateSession } = useWorkshopStore()
  const templateStore = useTemplateStore
  const project = projects.find((p) => p.id === projectId)

  const [wentWell, setWentWell] = useState(project?.retrospective?.wentWell || '')
  const [improvements, setImprovements] = useState(project?.retrospective?.improvements || '')
  const [templateName, setTemplateName] = useState('')
  const [saved, setSaved] = useState(false)

  if (!project) { navigate('/'); return null }

  const summary = summaryAgent.summarize({ projectId }, { getState: () => ({ projects }) })

  const handleSaveRetro = () => {
    updateRetrospective(projectId, { completedAt: new Date().toISOString(), wentWell, improvements })
    setSaved(true)
  }

  const handleSaveTemplate = () => {
    const name = templateName || `${project.name} 템플릿`
    templateStore.getState().saveTemplate(project, name)
    updateRetrospective(projectId, { savedAsTemplate: true })
    alert(`템플릿 "${name}"이 저장되었습니다!`)
  }

  const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1e293b', outline: 'none', background: '#fff', resize: 'none' }

  return (
    <Layout title="결과 요약 및 자산화" subtitle={project.name}>
      <div style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 차수별 결과 요약 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>차수별 결과 요약</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['차수', '날짜', '예상', '실제', '변동', '이슈', '메모'].map((h) => (
                    <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 11, color: '#94a3b8', fontWeight: 500, borderBottom: '1px solid #e8ecf0' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary?.sessionSummaries.map((s) => (
                  <tr key={s.sessionNumber} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <span style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff', borderRadius: 5, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>{s.sessionNumber}차</span>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748b' }}>{s.date || '-'}</td>
                    <td style={{ padding: '10px 16px', color: '#374151', textAlign: 'center' }}>{s.expectedParticipants || '-'}</td>
                    <td style={{ padding: '10px 16px', color: '#374151', textAlign: 'center' }}>{s.actualParticipants ?? '-'}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: s.delta > 0 ? '#22c55e' : s.delta < 0 ? '#ef4444' : '#94a3b8' }}>
                      {s.delta !== null && s.delta !== undefined ? (s.delta > 0 ? `+${s.delta}` : s.delta) : '-'}
                    </td>
                    <td style={{ padding: '10px 16px', color: s.issueCount > 0 ? '#ef4444' : '#94a3b8', textAlign: 'center' }}>{s.issueCount}</td>
                    <td style={{ padding: '10px 16px', color: '#94a3b8', textAlign: 'center' }}>{s.noteCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 20, fontSize: 13 }}>
            <span style={{ color: '#64748b' }}>총 예상: <strong style={{ color: '#0f172a' }}>{summary?.totalExpected}명</strong></span>
            <span style={{ color: '#64748b' }}>총 실제: <strong style={{ color: '#0f172a' }}>{summary?.totalActual || '-'}명</strong></span>
          </div>
        </div>

        {/* 차수별 메모 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>차수별 요약 메모</h2>
          {project.sessions.map((s) => (
            <div key={s.sessionNumber} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 5 }}>{s.sessionNumber}차 요약</label>
              <textarea style={{ ...inputStyle, height: 70 }} value={s.summary || ''}
                onChange={(e) => updateSession(projectId, s.sessionNumber, { summary: e.target.value })}
                placeholder="이 차수에서 특별히 기억할 내용..." />
            </div>
          ))}
        </div>

        {/* 프로젝트 회고 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>프로젝트 회고</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#16a34a', marginBottom: 5 }}>✓ 잘된 점</label>
              <textarea style={{ ...inputStyle, height: 80, borderColor: '#bbf7d0', background: '#f0fdf4' }} value={wentWell}
                onChange={(e) => setWentWell(e.target.value)} placeholder="이번 워크숍에서 특히 잘 진행된 부분은?" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#ea580c', marginBottom: 5 }}>△ 개선점</label>
              <textarea style={{ ...inputStyle, height: 80, borderColor: '#fed7aa', background: '#fff7ed' }} value={improvements}
                onChange={(e) => setImprovements(e.target.value)} placeholder="다음에는 어떻게 더 잘할 수 있을까요?" />
            </div>
          </div>
          <button onClick={handleSaveRetro} style={{
            marginTop: 14, padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: saved ? '#f0fdf4' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: saved ? '#16a34a' : '#fff'
          }}>{saved ? '✓ 저장됨' : '회고 저장'}</button>
        </div>

        {/* 돌발상황 전체 목록 */}
        {summary?.allIssues.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>전체 돌발상황 기록</h2>
            {summary.allIssues.map((inc) => (
              <div key={inc.id} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                <span style={{ color: '#ef4444', fontSize: 14 }}>⚠</span>
                <div>
                  <p style={{ fontSize: 13, color: '#374151' }}>{inc.issue}</p>
                  {inc.response && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>→ {inc.response}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 템플릿으로 저장 */}
        <div style={{ background: 'linear-gradient(135deg, #f5f3ff, #eff6ff)', borderRadius: 12, border: '1px solid #ddd6fe', padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6d28d9', marginBottom: 6 }}>자산으로 저장하기</h2>
          <p style={{ fontSize: 13, color: '#7c3aed', marginBottom: 16 }}>이 프로젝트를 템플릿으로 저장하면 다음 워크숍의 시작점으로 재활용할 수 있습니다.</p>
          {project.retrospective?.savedAsTemplate ? (
            <p style={{ fontSize: 13, color: '#7c3aed', fontWeight: 500 }}>✓ 이미 템플릿으로 저장되었습니다</p>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={templateName} onChange={(e) => setTemplateName(e.target.value)}
                placeholder={`${project.name} 템플릿`}
                style={{ flex: 1, border: '1px solid #ddd6fe', borderRadius: 8, padding: '9px 14px', fontSize: 13, color: '#1e293b', outline: 'none', background: '#fff' }} />
              <button onClick={handleSaveTemplate}
                style={{ background: '#7c3aed', border: 'none', borderRadius: 8, padding: '9px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                템플릿 저장
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/')}
          style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
          대시보드로 돌아가기
        </button>
      </div>
    </Layout>
  )
}
