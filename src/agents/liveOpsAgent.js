export const liveOpsAgent = {
  logTimeline({ projectId, sessionId }, { itemIndex, status }, store) {
    store.updateTimelineItemStatus(projectId, sessionId, itemIndex, status)
    return { success: true }
  },

  addNote({ projectId, sessionId }, { content }, store) {
    store.addLiveNote(projectId, sessionId, content)
    return { success: true }
  },

  addIncident({ projectId, sessionId }, { issue, response }, store) {
    store.addIncident(projectId, sessionId, issue, response)
    return { success: true }
  },

  getCurrentTimelineIndex(timeline) {
    const now = new Date()
    const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    for (let i = 0; i < timeline.length; i++) {
      const [start, end] = timeline[i].time?.split('-') || []
      if (start && end && hhmm >= start && hhmm <= end) return i
    }
    return -1
  },
}
