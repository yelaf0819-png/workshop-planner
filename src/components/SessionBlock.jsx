const TOOLS = ['Miro', 'Zoom', '패들릿', 'Menti', 'Jamboard', 'Google Meet', 'Teams']

const inputStyle = {
  width: '100%', border: '1px solid #e2e8f0', borderRadius: 8,
  padding: '9px 12px', fontSize: 13, color: '#1e293b', outline: 'none', background: '#fff', transition: 'border-color 0.15s'
}

export default function SessionBlock({ session, onChange, errors = [] }) {
  const sessionErrors = errors.filter((e) => e.session === session.sessionNumber || e.sessions?.includes(session.sessionNumber))
  const generateId = () => Math.random().toString(36).substr(2, 9)

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

  const focus = (e) => e.target.style.borderColor = '#3b82f6'
  const blur = (e) => e.target.style.borderColor = '#e2e8f0'

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', padding: '20px 24px', marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700
        }}>{session.sessionNumber}</div>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>{session.sessionNumber}차 워크숍</span>
      </div>

      {sessionErrors.length > 0 && (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          {sessionErrors.map((e, i) => <p key={i} style={{ fontSize: 12, color: '#c2410c' }}>{e.message}</p>)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>날짜</label>
          <input style={inputStyle} type="date" value={session.date || ''} onChange={(e) => onChange({ date: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>시작</label>
            <input style={inputStyle} type="time" value={session.startTime || ''} onChange={(e) => onChange({ startTime: e.target.value })} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>종료</label>
            <input style={inputStyle} type="time" value={session.endTime || ''} onChange={(e) => onChange({ endTime: e.target.value })} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>장소</label>
          <input style={inputStyle} type="text" value={session.venue || ''} placeholder="예: 본사 대회의실" onChange={(e) => onChange({ venue: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>예상 참여인원</label>
          <input style={inputStyle} type="number" value={session.expectedParticipants || ''} placeholder="0" onChange={(e) => onChange({ expectedParticipants: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>진행 방식</label>
          <select style={inputStyle} value={session.mode || '대면'} onChange={(e) => onChange({ mode: e.target.value })} onFocus={focus} onBlur={blur}>
            <option>대면</option><option>온라인</option><option>하이브리드</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5 }}>퍼실리테이터</label>
          <input style={inputStyle} type="text" value={session.facilitator || ''} placeholder="이름" onChange={(e) => onChange({ facilitator: e.target.value })} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      {/* 도구 */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 8 }}>사용 도구</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {TOOLS.map((tool) => {
            const active = (session.tools || []).includes(tool)
            return (
              <button key={tool} type="button"
                onClick={() => {
                  const tools = session.tools || []
                  onChange({ tools: tools.includes(tool) ? tools.filter((t) => t !== tool) : [...tools, tool] })
                }}
                style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1px solid ${active ? '#3b82f6' : '#e2e8f0'}`,
                  background: active ? '#eff6ff' : '#fff',
                  color: active ? '#3b82f6' : '#64748b',
                  fontWeight: active ? 600 : 400
                }}>{tool}</button>
            )
          })}
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
