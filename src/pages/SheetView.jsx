import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import Layout from '../components/Layout'
import OperationTable from '../components/OperationTable'
import { exportToPDF, exportToImage } from '../utils/exportPDF'
import { createShareLink } from '../utils/shareLink'

export default function SheetView() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects, updateProject } = useWorkshopStore()
  const project = projects.find((p) => p.id === projectId)

  if (!project) { navigate('/'); return null }

  const handleShare = () => {
    if (project.share?.linkId) {
      navigator.clipboard.writeText(`${window.location.origin}/shared/${project.share.linkId}`)
      alert('공유 링크가 클립보드에 복사되었습니다!')
      return
    }
    const linkData = createShareLink(projectId)
    updateProject(projectId, { share: { linkId: linkData.linkId, isPublic: true, expiresAt: null } })
    navigator.clipboard.writeText(linkData.url)
    alert('공유 링크가 생성되어 클립보드에 복사되었습니다!')
  }

  const btnBase = {
    border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px',
    fontSize: 12, cursor: 'pointer', background: '#fff', color: '#475569',
    display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500
  }

  return (
    <Layout
      title="운영판"
      subtitle={project.name}
      actions={
        <>
          <button style={btnBase} onClick={handleShare}>🔗 공유 링크</button>
          <button style={btnBase} onClick={() => exportToImage('operation-table', project.name)}>이미지</button>
          <button style={{ ...btnBase, background: '#eff6ff', color: '#3b82f6', borderColor: '#bfdbfe' }}
            onClick={() => exportToPDF('operation-table', project.name)}>PDF 내보내기</button>
        </>
      }
    >
      {/* 단계 표시 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, background: '#fff', borderRadius: 12, padding: '14px 24px', border: '1px solid #e8ecf0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {['프로젝트 확정', '기간·요소 입력', '운영판 생성', '사전 체크업'].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: i < 2 ? '#22c55e' : i === 2 ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#f1f5f9',
                color: i <= 2 ? '#fff' : '#94a3b8',
              }}>{i < 2 ? '✓' : i + 1}</div>
              <span style={{ fontSize: 12, fontWeight: i === 2 ? 600 : 400, color: i === 2 ? '#1e293b' : i < 2 ? '#22c55e' : '#94a3b8', whiteSpace: 'nowrap' }}>{step}</span>
            </div>
            {i < 3 && <div style={{ flex: 1, height: 1, background: '#e8ecf0', margin: '0 10px' }} />}
          </div>
        ))}
      </div>

      <OperationTable project={project} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20, maxWidth: 500 }}>
        <button onClick={() => navigate(`/session-input/${projectId}`)} style={{
          padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8,
          background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer'
        }}>← 수정하기</button>
        <button onClick={() => navigate(`/precheck/${projectId}`)} style={{
          padding: '12px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>사전 체크업 →</button>
      </div>
    </Layout>
  )
}
