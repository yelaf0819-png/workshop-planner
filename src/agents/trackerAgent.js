import { isD3Overdue } from '../utils/validateInterval'

export const trackerAgent = {
  updateStatus({ projectId }, { sessionNumber, status }, store) {
    store.updateSessionStatus(projectId, sessionNumber, status)
    return { success: true }
  },

  toggleChecklist({ projectId }, { sessionNumber, itemId }, store) {
    store.toggleChecklistItem(projectId, sessionNumber, itemId)
    return { success: true }
  },

  scheduleAlert({ projectId }, { sessionNumber, date }, store) {
    if (!isD3Overdue(date)) return { scheduled: false }
    const alert = { sessionNumber, type: 'D-3', scheduledFor: date }
    const project = store.getState().projects.find((p) => p.id === projectId)
    if (!project) return { scheduled: false }
    store.updateProject(projectId, {
      alerts: [...(project.alerts || []), alert],
    })

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`워크숍 D-3 알림`, {
        body: `${project.name} ${sessionNumber}차 워크숍이 3일 후입니다. 준비물을 확인해주세요!`,
      })
    }
    return { scheduled: true, alert }
  },

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  },
}
