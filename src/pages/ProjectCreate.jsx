import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import Layout from '../components/Layout'
import { projectAgent } from '../agents/projectAgent'

const WORKSHOP_TYPES = ['직무교육', '리더십', '전략기획', '퍼실리테이션', '팀빌딩', '온보딩', '기타']

const STEPS = ['프로젝트 확정', '기간·요소 입력', '운영판 생성', '사전 체크업']

const inputStyle = {
  width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
  padding: '10px 14px', fontSize: 13, color: '#1e293b',
  outline: 'none', background: '#fff', transition: 'border-color 0.15s',
}

export default function ProjectCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const template = location.state?.template

  const [form, setForm] = useState({
    name: template?.name ? `${template.name} (복사)` : '',
    client: template?.client || '',
    manager: '',
    managerTitle: '',
    managerEmail: '',
    managerPhone: '',
    totalSessions: template?.totalSessions || 1,
    type: template?.type || '',
    memo: '',
    templateId: template?.id || null,
  })
  const [errors, setErrors] = useState([])

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = projectAgent.validate(form)
    if (validationErrors.length > 0) { setErrors(validationErrors); return }
    const result = projectAgent.create(form, useWorkshopStore.getState())
    if (result.success) navigate(`/session-input/${result.projectId}`)
  }

  return (
    <Layout title="새 프로젝트 만들기" subtitle="프로젝트 기본 정보를 입력하세요">
      {/* 단계 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28, background: '#fff', borderRadius: 12, padding: '16px 24px', border: '1px solid #e8ecf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {STEPS.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                background: i === 0 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : i < 0 ? '#22c55e' : '#f1f5f9',
                color: i === 0 ? '#fff' : '#94a3b8',
              }}>{i + 1}</div>
              <span style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#1e293b' : '#94a3b8', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: '#e8ecf0', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 600 }}>
        {template && (
          <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>📋</span>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#7c3aed' }}>템플릿에서 시작: </span>
              <span style={{ fontSize: 13, color: '#6d28d9' }}>{template.name}</span>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
            {errors.map((e, i) => <p key={i} style={{ fontSize: 13, color: '#dc2626' }}>{e}</p>)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>프로젝트명 <span style={{ color: '#ef4444' }}>*</span></label>
              <input style={inputStyle} type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)}
                placeholder="예: OO기업 리더십 워크숍 3기"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>고객사/담당팀</label>
              <input style={inputStyle} type="text" value={form.client} onChange={(e) => handleChange('client', e.target.value)}
                placeholder="예: OO기업 / 국내생산리더육성팀"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>담당자 이름</label>
                <input style={inputStyle} type="text" value={form.manager} onChange={(e) => handleChange('manager', e.target.value)}
                  placeholder="예: 홍길동"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>담당자 직급</label>
                <input style={inputStyle} type="text" value={form.managerTitle} onChange={(e) => handleChange('managerTitle', e.target.value)}
                  placeholder="예: 팀장"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>담당자 이메일</label>
                <input style={inputStyle} type="email" value={form.managerEmail} onChange={(e) => handleChange('managerEmail', e.target.value)}
                  placeholder="예: hong@company.com"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>담당자 연락처</label>
                <input style={inputStyle} type="tel" value={form.managerPhone} onChange={(e) => handleChange('managerPhone', e.target.value)}
                  placeholder="예: 010-0000-0000"
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>총 차수 <span style={{ color: '#ef4444' }}>*</span></label>
                <input style={inputStyle} type="number" min="1" max="20" value={form.totalSessions}
                  onChange={(e) => handleChange('totalSessions', parseInt(e.target.value) || 1)}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>워크숍 유형</label>
                <select style={inputStyle} value={form.type} onChange={(e) => handleChange('type', e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}>
                  <option value="">선택하세요</option>
                  {WORKSHOP_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>메모/특이사항</label>
              <textarea style={{ ...inputStyle, resize: 'none', height: 80 }} value={form.memo}
                onChange={(e) => handleChange('memo', e.target.value)}
                placeholder="특이사항이나 메모를 입력하세요"
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={() => navigate('/')} style={{
                flex: 1, padding: '11px', border: '1px solid #e2e8f0', borderRadius: 8,
                background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer'
              }}>취소</button>
              <button type="submit" style={{
                flex: 2, padding: '11px',
                background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}>다음 단계: 기간 및 요소 입력 →</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}
