import { useNavigate, useParams } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'
import TimelineView from '../components/TimelineView'
import LiveNoteInput from '../components/LiveNoteInput'
import IncidentLog from '../components/IncidentLog'

export default function LiveOps() {
  const { projectId, sessionNumber } = useParams()
  const navigate = useNavigate()
  const { projects, updateSession, updateTimelineItemStatus, addLiveNote, addIncident } = useWorkshopStore()
  const project = projects.find((p) => p.id === projectId)
  const session = project?.sessions.find((s) => s.sessionNumber === parseInt(sessionNumber))

  if (!project || !session) { navigate('/'); return null }

  const handleActualParticipants = (val) => {
    const actual = parseInt(val) || 0
    const expected = parseInt(session.expectedParticipants) || 0
    updateSession(projectId, session.sessionNumber, { actualParticipants: actual, participantDelta: actual - expected })
  }

  const statusColor = { 준비중: '#64748b', 진행중: '#3b82f6', 완료: '#22c55e', 취소: '#ef4444' }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1b2d', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <header style={{ background: '#162032', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate(`/precheck/${projectId}`)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: '7px 12px', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>
            ← 나가기
          </button>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Step 5: 당일 운영</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{project.name} · {session.sessionNumber}차 · {session.date}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 600 }}>
            {session.status}
          </span>
          <button
            onClick={() => { updateSession(projectId, session.sessionNumber, { status: '완료' }); navigate(`/precheck/${projectId}`) }}
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            차수 완료 처리
          </button>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 800, margin: '0 auto', width: '100%', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 인원 카드 */}
        <div style={{ background: '#162032', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>참여인원</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9' }}>{session.expectedParticipants || 0}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>예상</div>
            </div>
            <div style={{ color: '#334155', fontSize: 24, fontWeight: 300 }}>→</div>
            <div style={{ textAlign: 'center' }}>
              <input type="number" value={session.actualParticipants ?? ''} onChange={(e) => handleActualParticipants(e.target.value)}
                placeholder="0"
                style={{ width: 80, fontSize: 36, fontWeight: 800, textAlign: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#f1f5f9', outline: 'none', padding: '4px 0' }} />
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>실제</div>
            </div>
            {session.participantDelta !== null && session.participantDelta !== undefined && (
              <div style={{ fontSize: 22, fontWeight: 700, color: session.participantDelta >= 0 ? '#4ade80' : '#f87171' }}>
                {session.participantDelta > 0 ? '+' : ''}{session.participantDelta}
              </div>
            )}
          </div>
          {session.participantDelta !== null && session.participantDelta !== 0 && (
            <input type="text" value={session.deltaReason || ''} onChange={(e) => updateSession(projectId, session.sessionNumber, { deltaReason: e.target.value })}
              placeholder="변동 사유를 입력하세요"
              style={{ marginTop: 12, width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 14px', color: '#cbd5e1', fontSize: 13, outline: 'none' }} />
          )}
        </div>

        {/* 타임라인 */}
        <div style={{ background: '#162032', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>타임라인</h2>
          {session.timeline?.length > 0 ? (
            <TimelineView timeline={session.timeline} projectId={projectId} sessionNumber={session.sessionNumber}
              onUpdate={(idx, status) => updateTimelineItemStatus(projectId, session.sessionNumber, idx, status)} />
          ) : (
            <div style={{ textAlign: 'center', color: '#475569', fontSize: 13, padding: '20px 0' }}>타임라인이 없습니다. 세션 입력 화면에서 추가해주세요.</div>
          )}
        </div>

        {/* 실시간 메모 */}
        <div style={{ background: '#162032', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>실시간 메모</h2>
          <LiveNoteInput notes={session.liveNotes || []} onAdd={(content) => addLiveNote(projectId, session.sessionNumber, content)} dark />
        </div>

        {/* 돌발상황 */}
        <div style={{ background: '#162032', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', padding: '20px 24px' }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>돌발상황 기록</h2>
          <IncidentLog incidents={session.incidents || []} onAdd={(issue, response) => addIncident(projectId, session.sessionNumber, issue, response)} dark />
        </div>
      </main>
    </div>
  )
}
