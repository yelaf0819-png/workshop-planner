import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useWorkshopStore from './store/useWorkshopStore'
import useTemplateStore from './store/useTemplateStore'
import Dashboard from './pages/Dashboard'
import ProjectCreate from './pages/ProjectCreate'
import ProjectDetail from './pages/ProjectDetail'
import SessionInput from './pages/SessionInput'
import SheetView from './pages/SheetView'
import PreCheck from './pages/PreCheck'
import LiveOps from './pages/LiveOps'
import Retrospective from './pages/Retrospective'
import TemplateLibrary from './pages/TemplateLibrary'

export default function App() {
  const syncProjects = useWorkshopStore((s) => s.syncFromSupabase)
  const syncTemplates = useTemplateStore((s) => s.syncFromSupabase)

  useEffect(() => {
    // Supabase가 설정된 경우 앱 시작 시 데이터 동기화
    syncProjects()
    syncTemplates()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<ProjectCreate />} />
        <Route path="/project/:projectId" element={<ProjectDetail />} />
        <Route path="/session-input/:projectId" element={<SessionInput />} />
        <Route path="/sheet/:projectId" element={<SheetView />} />
        <Route path="/precheck/:projectId" element={<PreCheck />} />
        <Route path="/live/:projectId/:sessionNumber" element={<LiveOps />} />
        <Route path="/retrospective/:projectId" element={<Retrospective />} />
        <Route path="/templates" element={<TemplateLibrary />} />
      </Routes>
    </BrowserRouter>
  )
}
