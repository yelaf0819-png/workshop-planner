import { useState } from 'react'

const ONLINE_TOOLS = ['Miro', 'Zoom', '패들릿', 'Menti', 'Jamboard', 'Google Meet', 'Teams']
const OFFLINE_TOOLS = ['ㅋㄷㅋㄷ카드', '워크모티베이션카드', '워크시트', '포스트잇', '전지', '마카', '네임텐트', '핸드아웃']
const FACILITATORS = ['피스', '빌리', '콰지', '마크']

const inputStyle = {
  width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: '#1e293b', outline: 'none', background: '#fff', transition: 'border-color 0.15s'
}

export default function SessionBlock({ session, onChange, errors = [], allSessions = [] }) {
  const [showCopyMenu, setShowCopyMenu] = useState(false)
  const isCustomFacilitator = session.facilitator && !FACILITATORS.includes(session.facilitator)
  const [facilitatorMode, setFacilitatorMode] = useState(isCustomFacilitator ? 'custom' : 'preset')

  const sessionErrors = errors.filter((e) => e.session === session.sessionNumber || e.sessions?.includes(session.sessionNumber))
  const generateId = () => Math.random().toString(36).substr(2, 9)

  const otherSessions = allSessions.filter((s) => s.sessionNumber !== session.sessionNumber)

  const copyFromSession = (src) => {
    onChange({
      date: src.date,
      endDate: src.endDate || '',
      startTime: src.startTime,
      endTime: src.endTime,
      venue: src.venue,
      expectedParticipants: src.expectedParticipants,
      mode: src.mode,
      tools: [...(src.tools || [])],
      checklist: (src.checklist || []).map((c) => ({ ...c, id: generateId(), done: false })),
      facilitator: src.facilitator,
      timeline: (src.timeline || []).map((t) => ({ ...t, status: '대기' })),
    })
    setShowCopyMenu(false)
    if (src.facilitator && !FACILITATORS.includes(src.facilitator)) {
      setFacilitatorMode('custom')
    } else {
      setFacilitatorMode('preset')
    }
  }

  const addChecklistItem = () => {
    const text = prompt('준비물 항목을 입력하세요')
    if (!text) return
    onChange({ checklist: [...(session.checklist || []), { id: generateId(), item: text, done: false }] })
  }

  const addTimelineItem = () => {
    const time = prompt('시간대를 입력하세요 (예: 10:00-10:30)')
    const title = prompt('프로그램 제목을 입력하세요')
    if (!time || !title) return
    onChange({ timeline: [...(session.timeline || []), { time, title, status: '대기' }] })
  }

  const toggleTool = (tool) => {
    const tools = session.tools || []
    onChange({ tools: tools.includes(tool) ? tools.filter((t) => t !== tool) : [...tools, tool] })
  }

  const focus = (e) => e.target.style.borderColor = '#3b82f6'
  const blur = (e) => e.target.style.borderColor = '#e2e8f0'

  const ToolBtn = ({ tool }) => {
    const active = (session.tools || []).includes(tool)
    return (
      <button key={tool} type="button" onClick={() => toggleTool(tool)}
        style={{
          padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
          border: `1px solid ${active ? '#3b82f6' : '#e2e8f0'}`,
          background: active ? '#eff6ff' : '#fff',
          color: active ? '#3b82f6' : '#64748b',
          fontWeight: active ? 600 : 400
        }}>{tool}</button>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700
          }}>{session.sessionNumber}</div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{session.sessionNumber}차 워크숍</span>
        </div>

        {otherSessions.length > 0 && (
          <div style={{ position: 'relative' }}>
            <button type="button" onClick={() => setShowCopyMenu((v) => !v)}
              style={{ fontSize: 12, color: '#3b82f6', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '5px 10px', cursor: 'pointer' }}>
              다른 차수에서 복사
            </button>
            {showCopyMenu && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: 140 }}>
                {otherSessions.map((s) => (
                  <button key={s.sessionNumber} type="button" onClick={() => copyFromSession(s)}
                    style={{ display: 'block', width: '100%', padding: '8px 14px', textAlign: 'left', fontSize: 13, color: '#374151', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}>
                    {s.sessionNumber}차수에서 복사
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {sessionErrors.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          {sessionErrors.map((e, i) => <p key={i} style={{ fontSize: 12, color: '#c2410c' }}>{e.message}</p>)}
        </div>
      )}

      {/* 날짜: 시작일 + 종료일 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>시작일</label>
          <input style={inputStyle} type="date" value={session.date || ''} onChange={(e) => onChange({ date: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>종료일 <span style={{ color: '#94a3b8', fontWeight: 400 }}>(1박 2일 이상인 경우)</span></label>
          <input style={inputStyle} type="date" value={session.endDate || ''} min={session.date || ''}
            onChange={(e) => onChange({ endDate: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* 시간 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>시작 시간</label>
          <input style={inputStyle} type="time" value={session.startTime || ''} onChange={(e) => onChange({ startTime: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>종료 시간</label>
          <input style={inputStyle} type="time" value={session.endTime || ''} onChange={(e) => onChange({ endTime: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* 장소 / 예상인원 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>장소</label>
          <input style={inputStyle} type="text" value={session.venue || ''} placeholder="예: 본사 대회의실" onChange={(e) => onChange({ venue: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>예상 참여인원</label>
          <input style={inputStyle} type="number" value={session.expectedParticipants || ''} placeholder="0" onChange={(e) => onChange({ expectedParticipants: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* 진행 방식 / 퍼실리테이터 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>진행 방식</label>
          <select style={inputStyle} value={session.mode || '대면'} onChange={(e) => onChange({ mode: e.target.value })} onFocus={focus} onBlur={blur}>
            <option>대면</option><option>온라인</option><option>하이브리드</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>퍼실리테이터</label>
          <select style={inputStyle}
            value={facilitatorMode === 'custom' ? '기타' : (session.facilitator || '')}
            onChange={(e) => {
              if (e.target.value === '기타') {
                setFacilitatorMode('custom')
                onChange({ facilitator: '' })
              } else {
                setFacilitatorMode('preset')
                onChange({ facilitator: e.target.value })
              }
            }}
            onFocus={focus} onBlur={blur}>
            <option value="">선택하세요</option>
            {FACILITATORS.map((f) => <option key={f} value={f}>{f}</option>)}
            <option value="기타">기타 (직접 입력)</option>
          </select>
          {facilitatorMode === 'custom' && (
            <input style={{ ...inputStyle, marginTop: 6 }} type="text"
              value={session.facilitator || ''} placeholder="이름 입력"
              onChange={(e) => onChange({ facilitator: e.target.value })} onFocus={focus} onBlur={blur} />
          )}
        </div>
      </div>

      {/* 사용 도구 */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 8 }}>사용 도구</label>

        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>온라인</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {ONLINE_TOOLS.map((tool) => <ToolBtn key={tool} tool={tool} />)}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>오프라인 (리얼워크)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {OFFLINE_TOOLS.map((tool) => <ToolBtn key={tool} tool={tool} />)}
          </div>
        </div>
      </div>

      {/* 준비물 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: '#64748b' }}>준비물 체크리스트</label>
          <button type="button" onClick={addChecklistItem} style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>+ 추가</button>
        </div>
        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', minHeight: 40 }}>
          {(session.checklist || []).map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
              <span style={{ fontSize: 13, color: '#374151', flex: 1 }}>□ {item.item}</span>
              <button type="button" onClick={() => onChange({ checklist: session.checklist.filter((c) => c.id !== item.id) })}
                style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
          ))}
          {(!session.checklist || session.checklist.length === 0) && (
            <p style={{ fontSize: 12, color: '#cbd5e1', textAlign: 'center', padding: '6px 0' }}>준비물을 추가해주세요</p>
          )}
        </div>
      </div>

      {/* 타임라인 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: '#64748b' }}>타임라인 (당일 운영용)</label>
          <button type="button" onClick={addTimelineItem} style={{ fontSize: 12, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>+ 추가</button>
        </div>
        {(session.timeline || []).map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '5px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', width: 110, flexShrink: 0 }}>{item.time}</span>
            <span style={{ fontSize: 12, color: '#374151' }}>{item.title}</span>
          </div>
        ))}
      </div>

      {/* 특이사항 */}
      <div>
        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>특이사항</label>
        <textarea style={{ ...inputStyle, resize: 'none', height: 70 }} value={session.notes || ''}
          placeholder="특이사항을 입력하세요"
          onChange={(e) => onChange({ notes: e.target.value })} onFocus={focus} onBlur={blur} />
      </div>
    </div>
  )
}
