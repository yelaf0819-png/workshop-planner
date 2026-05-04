import { useState } from 'react'
import { format } from 'date-fns'

export default function IncidentLog({ incidents = [], onAdd, dark = false }) {
  const [issue, setIssue] = useState('')
  const [response, setResponse] = useState('')
  const [open, setOpen] = useState(false)

  const handleAdd = () => {
    if (!issue.trim()) return
    onAdd(issue.trim(), response.trim())
    setIssue('')
    setResponse('')
    setOpen(false)
  }

  const bg = dark ? 'rgba(255,255,255,0.05)' : '#fff7ed'
  const border = dark ? 'rgba(255,255,255,0.1)' : '#fed7aa'
  const inputStyle = {
    width: '100%', background: dark ? 'rgba(255,255,255,0.05)' : '#fff',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#fed7aa'}`,
    borderRadius: 8, padding: '9px 14px', fontSize: 13,
    color: dark ? '#cbd5e1' : '#1e293b', outline: 'none'
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        style={{ fontSize: 13, color: '#f97316', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
        ⚠ 돌발상황 기록 {open ? '▲' : '▼'}
      </button>

      {open && (
        <div style={{ background: dark ? 'rgba(249,115,22,0.1)' : '#fff7ed', border: `1px solid ${dark ? 'rgba(249,115,22,0.2)' : '#fed7aa'}`, borderRadius: 10, padding: '14px', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input style={inputStyle} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="이슈 내용" />
          <input style={inputStyle} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="대응 방법" />
          <button onClick={handleAdd}
            style={{ background: '#f97316', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
            기록하기
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {incidents.map((inc) => (
          <div key={inc.id} style={{ padding: '10px 14px', background: dark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${dark ? 'rgba(239,68,68,0.2)' : '#fecaca'}`, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{format(new Date(inc.timestamp), 'HH:mm')}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#ef4444' }}>이슈</span>
            </div>
            <p style={{ fontSize: 13, color: dark ? '#fca5a5' : '#dc2626', marginBottom: inc.response ? 4 : 0 }}>{inc.issue}</p>
            {inc.response && <p style={{ fontSize: 12, color: dark ? '#94a3b8' : '#64748b' }}>→ {inc.response}</p>}
          </div>
        ))}
        {incidents.length === 0 && (
          <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center', padding: '10px 0' }}>기록된 돌발상황이 없습니다</p>
        )}
      </div>
    </div>
  )
}
