import { useState } from 'react'
import { format } from 'date-fns'

export default function LiveNoteInput({ notes = [], onAdd, dark = false }) {
  const [text, setText] = useState('')

  const handleAdd = () => {
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  const bg = dark ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const border = dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0'
  const textColor = dark ? '#cbd5e1' : '#374151'
  const placeholderColor = dark ? '#475569' : '#94a3b8'

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="관찰 내용이나 코멘트를 입력하세요..."
          style={{ flex: 1, background: bg, border, borderRadius: 8, padding: '9px 14px', fontSize: 13, color: textColor, outline: 'none' }} />
        <button onClick={handleAdd}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', borderRadius: 8, padding: '9px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          기록
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
        {[...notes].reverse().map((note) => (
          <div key={note.id} style={{ display: 'flex', gap: 12, padding: '8px 12px', background: bg, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: '#64748b', flexShrink: 0, paddingTop: 2, fontFamily: 'monospace' }}>
              {format(new Date(note.timestamp), 'HH:mm')}
            </span>
            <p style={{ fontSize: 13, color: textColor }}>{note.content}</p>
          </div>
        ))}
        {notes.length === 0 && (
          <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '16px 0' }}>기록된 메모가 없습니다</p>
        )}
      </div>
    </div>
  )
}
