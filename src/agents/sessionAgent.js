const generateId = () => Math.random().toString(36).substr(2, 9)

export const sessionAgent = {
  save({ projectId, sessionId }, payload, store) {
    store.updateSession(projectId, sessionId, payload)
    return { success: true }
  },

  parse(raw) {
    return {
      ...raw,
      expectedParticipants: parseInt(raw.expectedParticipants) || 0,
      checklist: (raw.checklist || []).map((item) =>
        typeof item === 'string'
          ? { id: generateId(), item, done: false }
          : item
      ),
      tools: Array.isArray(raw.tools) ? raw.tools : [],
      timeline: (raw.timeline || []).map((t) => ({
        ...t,
        status: t.status || '대기',
      })),
    }
  },

  applyTemplate(session, templateSession) {
    return {
      ...session,
      mode: templateSession.mode,
      tools: [...templateSession.tools],
      checklist: templateSession.checklist.map((c) => ({
        ...c,
        id: generateId(),
        done: false,
      })),
      facilitator: templateSession.facilitator,
      timeline: templateSession.timeline?.map((t) => ({ ...t, status: '대기' })) || [],
    }
  },
}
