import { useNavigate, useLocation } from 'react-router-dom'
import useWorkshopStore from '../store/useWorkshopStore'

const NAV_ITEMS = [
  { label: '대시보드', icon: '⊞', path: '/' },
  { label: '워크숍 관리', icon: '📋', path: '/workshops' },
  { label: '템플릿 라이브러리', icon: '📁', path: '/templates' },
]

export default function Layout({ children, title, subtitle, actions }) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 사이드바 */}
      <aside style={{
        width: 210,
        minWidth: 210,
        background: '#0f1b2d',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}>
        {/* 로고 */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: '#fff'
            }}>W</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>워크숍</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>운영판 관리</div>
            </div>
          </div>
        </div>

        {/* 네비 */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  marginBottom: 4, fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: active ? '#60a5fa' : '#94a3b8',
                  textAlign: 'left', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#cbd5e1' } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8' } }}
              >
                <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* 하단 */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0
            }}>운</div>
            <div>
              <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 500 }}>운영자</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>관리자</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 메인 */}
      <div style={{ flex: 1, marginLeft: 210, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* 상단 헤더 */}
        {(title || actions) && (
          <header style={{
            background: '#fff', borderBottom: '1px solid #e8ecf0',
            padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 50,
          }}>
            <div>
              {title && <h1 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{title}</h1>}
              {subtitle && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
          </header>
        )}

        {/* 콘텐츠 */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
          {children}
        </main>

        <footer style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: 12, borderTop: '1px solid #e8ecf0', background: '#fff' }}>
          © 2026 Workshop Planner. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
