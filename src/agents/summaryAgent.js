export const summaryAgent = {
  summarize({ projectId }, store) {
    const project = store.getState().projects.find((p) => p.id === projectId)
    if (!project) return null

    const sessionSummaries = project.sessions.map((s) => ({
      sessionNumber: s.sessionNumber,
      date: s.date,
      expectedParticipants: s.expectedParticipants,
      actualParticipants: s.actualParticipants,
      delta: s.participantDelta,
      deltaReason: s.deltaReason,
      issueCount: s.incidents?.length || 0,
      noteCount: s.liveNotes?.length || 0,
      summary: s.summary,
      incidents: s.incidents || [],
    }))

    const totalExpected = project.sessions.reduce(
      (sum, s) => sum + (parseInt(s.expectedParticipants) || 0), 0
    )
    const totalActual = project.sessions.reduce(
      (sum, s) => sum + (parseInt(s.actualParticipants) || 0), 0
    )

    return {
      projectId,
      projectName: project.name,
      sessionSummaries,
      totalExpected,
      totalActual,
      allIssues: project.sessions.flatMap((s) => s.incidents || []),
      allNotes: project.sessions.flatMap((s) => s.liveNotes || []),
    }
  },

  isProjectComplete(project) {
    return (
      project.sessions.length > 0 &&
      project.sessions.every(
        (s) => s.status === '완료' || s.status === '취소'
      )
    )
  },
}
