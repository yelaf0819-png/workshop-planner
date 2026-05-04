import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import DDayBadge from './DDayBadge'
import ProgressBar from './ProgressBar'
import { getNextSession } from '../utils/dday'

export default function ProjectCard({ project, onDelete }) {
  const navigate = useNavigate()
  const completed = project.sessions.filter((s) => s.status === '완료').length
  const nextSession = getNextSession(project.sessions)

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-base">{project.name}</h3>
          <p className="text-sm text-gray-500">{project.client} · {project.manager}</p>
        </div>
        <div className="flex items-center gap-2">
          {nextSession && <DDayBadge date={nextSession.date} highlight={true} />}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(project.id) }}
            className="text-gray-300 hover:text-red-400 text-lg leading-none"
            title="프로젝트 삭제"
          >×</button>
        </div>
      </div>

      <div className="mb-3">
        <ProgressBar completed={completed} total={project.sessions.length} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{project.type}</span>
        <span>생성 {project.createdAt}</span>
      </div>

      {nextSession && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          다음 차수: {nextSession.sessionNumber}차 · {nextSession.date} · {nextSession.venue || '장소 미정'}
        </div>
      )}
    </div>
  )
}
