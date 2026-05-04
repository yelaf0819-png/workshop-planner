import { useNavigate } from 'react-router-dom'
import useTemplateStore from '../store/useTemplateStore'
import Layout from '../components/Layout'

export default function TemplateLibrary() {
  const navigate = useNavigate()
  const { templates, deleteTemplate } = useTemplateStore()

  return (
    <Layout title="템플릿 라이브러리" subtitle="저장된 템플릿으로 빠르게 시작하세요"
      actions={
        <button onClick={() => navigate('/create')} style={{
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff',
          border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>+ 새 프로젝트</button>
      }>
      {templates.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 12, border: '2px dashed #e2e8f0', padding: '64px 32px', textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>저장된 템플릿이 없습니다</p>
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>워크숍을 완료한 후 회고 화면에서<br />템플릿으로 저장해보세요</p>
          <button onClick={() => navigate('/')} style={{ fontSize: 13, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            대시보드로 돌아가기
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, maxWidth: 900 }}>
          {templates.map((template) => (
            <div key={template.id} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{template.name}</h3>
                  <p style={{ fontSize: 12, color: '#94a3b8' }}>{template.client} · {template.type} · {template.totalSessions}차수</p>
                  <p style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>저장일: {template.createdAt} · 사용 {template.usageCount}회</p>
                </div>
                <button onClick={() => { if (confirm('템플릿을 삭제하시겠습니까?')) deleteTemplate(template.id) }}
                  style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
              </div>

              <div style={{ padding: '14px 20px' }}>
                {template.sessionDefaults?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>차수 구성</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {template.sessionDefaults.map((s) => (
                        <span key={s.sessionNumber} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 11, color: '#64748b', padding: '3px 10px', borderRadius: 20 }}>
                          {s.sessionNumber}차 · {s.mode}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {template.commonChecklist?.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>공통 준비물</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {template.commonChecklist.map((item, i) => (
                        <span key={i} style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => navigate('/create', { state: { template } })}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  이 템플릿으로 시작하기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
