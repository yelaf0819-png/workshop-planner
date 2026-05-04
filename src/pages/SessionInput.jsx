import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import Layout from '../components/Layout'
import SessionBlock from '../components/SessionBlock'
import { sessionAgent } from '../agents/sessionAgent'
import { validateSessions } from '../utils/validateInterval'

const STEPS = ['프로젝트 확정', '기간·요소 입력', '운영판 생성', '사전 체크업']

export default function SessionInput() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, updateSession, updateCommonSettings } = useWorkshopStore()
  const project = projects.find((p) => p.id === projectId)

  const [sessions, setSessions] = useState(project?.sessions || [])
  const [common, setCommon] = useState(
    project?.commonSettings || { commonChecklist: [], taxInvoiceDate: '', reportDeadline: '' }
  )
  const [commonText, setCommonText] = useState('')
  const [errors, setErrors] = useState([])

  useEffect(() => { if (!project) navigate('/') }, [project])
  if (!project) return null

  const handleSessionChange = (sessionNumber, data) => {
    setSessions((prev) => prev.map((s) => s.sessionNumber === sessionNumber ? { ...s, ...data } : s))
  }

  const addCommonItem = () => {
    if (!commonText.trim()) return
    setCommon((c) => ({ ...c, commonChecklist: [...c.commonChecklist, commonText.trim()] }))
    setCommonText('')
  }

  const handleSave = () => {
    const intervalErrors = validateSessions(sessions)
    setErrors(intervalErrors)
    sessions.forEach((s) => {
      const parsed = sessionAgent.parse(s)
      updateSession(projectId, s.sessionNumber, parsed)
    })
    updateCommonSettings(projectId, common)
    navigate(`/sheet/${projectId}`)
  }

  const inputStyle = {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
    padding: '9px 12px', fontSize: 13, color: '#1e293b', outline: 'none', background: '#fff'
  }

  return (
    <Layout title="기간 및 필요요소 입력" subtitle={`${project.name} · 총 ${project.totalSessions}차수`}>
      {/* 단계 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, background: '#fff', borderRadius: 12, padding: '14px 24px', border: '1px solid #e8ecf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: i < 1 ? '#22c55e' : i === 1 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#f1f5f9',
                color: i <= 1 ? '#fff' : '#94a3b8',
              }}>{i < 1 ? '✓' : i + 1}</div>
              <span style={{ fontSize: 12, fontWeight: i === 1 ? 600 : 400, color: i === 1 ? '#1e293b' : i < 1 ? '#22c55e' : '#94a3b8', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: '#e8ecf0', margin: '0 10px' }} />}
          </div>
        ))}
      </div>

      {errors.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#ea580c', marginBottom: 4 }}>⚠ 일정 검증 경고</p>
          {errors.map((e, i) => <p key={i} style={{ fontSize: 12, color: '#c2410c' }}>{e.message}</p>)}
        </div>
      )}

      <div style={{ maxWidth: 720 }}>
        {/* 공통 설정 - 상단 배치 */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 }}>공통 설정 <span style={{ fontSize: 12, fontWeight: 400, color: '#94a3b8' }}>전 차수 동일 적용</span></h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 8 }}>공통 준비물</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input style={{ ...inputStyle, flex: 1 }} value={commonText}
                onChange={(e) => setCommonText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCommonItem()}
                placeholder="전 차수 공통 준비물을 입력하세요" />
              <button type="button" onClick={addCommonItem} style={{
                background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8,
                padding: '9px 14px', fontSize: 13, color: '#64748b', cursor: 'pointer'
              }}>추가</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {common.commonChecklist.map((item, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 12, padding: '3px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item}
                  <button onClick={() => setCommon((c) => ({ ...c, commonChecklist: c.commonChecklist.filter((_, idx) => idx !== i) }))}
                    style={{ background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 6 }}>세금계산서 발행일</label>
            <input style={{ ...inputStyle, width: 200 }} type="date"
              value={common.taxInvoiceDate || common.reportDeadline || ''}
              onChange={(e) => setCommon((c) => ({ ...c, taxInvoiceDate: e.target.value, reportDeadline: e.target.value }))} />
          </div>
        </div>

        {sessions.map((s, i) => (
          <SessionBlock key={s.sessionNumber} session={s} index={i}
            onChange={(data) => handleSessionChange(s.sessionNumber, data)}
            errors={errors}
            allSessions={sessions} />
        ))}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => navigate(`/create`)} style={{
            flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8,
            background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer'
          }}>← 이전</button>
          <button onClick={handleSave} style={{
            flex: 2, padding: '12px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>운영판 생성 →</button>
        </div>
      </div>
    </Layout>
  )
}
