import { calcDday, formatDday } from '../utils/dday'
import { createShareLink } from '../utils/shareLink'

export const sheetGenerator = {
  generate({ projectId }, store) {
    const project = store.getState().projects.find((p) => p.id === projectId)
    if (!project) return null

    return {
      ...project,
      sessions: project.sessions.map((s) => ({
        ...s,
        dday: calcDday(s.date),
        ddayLabel: formatDday(calcDday(s.date)),
      })),
    }
  },

  makeShareLink({ projectId }, store) {
    const linkData = createShareLink(projectId)
    store.updateProject(projectId, {
      share: {
        linkId: linkData.linkId,
        isPublic: true,
        expiresAt: null,
      },
    })
    return linkData
  },
}
