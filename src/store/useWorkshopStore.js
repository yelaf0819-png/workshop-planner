import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  fetchAllProjects,
  upsertProject,
  upsertSessions,
  deleteProjectFromDb,
} from '../lib/syncService'

const generateId = () => Math.random().toString(36).substr(2, 9)

const defaultSession = (number) => ({
  sessionNumber: number,
  date: '',
  startTime: '',
  endTime: '',
  venue: '',
  expectedParticipants: '',
  actualParticipants: null,
  participantDelta: null,
  deltaReason: '',
  mode: '대면',
  tools: [],
  checklist: [],
  facilitator: '',
  status: '준비중',
  notes: '',
  summary: '',
  timeline: [],
  liveNotes: [],
  incidents: [],
})

const useWorkshopStore = create(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      synced: false,

      // Supabase에서 초기 데이터 로드
      syncFromSupabase: async () => {
        const remoteProjects = await fetchAllProjects()
        if (remoteProjects && remoteProjects.length > 0) {
          set({ projects: remoteProjects, synced: true })
        } else {
          set({ synced: true })
        }
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get()
        return projects.find((p) => p.id === currentProjectId) || null
      },

      createProject: (data) => {
        const id = generateId()
        const totalSessions = parseInt(data.totalSessions) || 1
        const sessions = Array.from({ length: totalSessions }, (_, i) => defaultSession(i + 1))
        const project = {
          id,
          ...data,
          totalSessions,
          createdAt: new Date().toISOString().split('T')[0],
          templateId: data.templateId || null,
          sourceProjectId: data.sourceProjectId || null,
          sessions,
          commonSettings: { commonChecklist: [], reportDeadline: '' },
          share: { linkId: null, isPublic: false, expiresAt: null },
          alerts: [],
          retrospective: {
            completedAt: null, wentWell: '', improvements: '',
            savedAsTemplate: false, templateId: null,
          },
        }
        set((state) => ({ projects: [...state.projects, project], currentProjectId: id }))
        upsertProject(project)
        return id
      },

      cloneProject: (sourceId, overrides = {}) => {
        const source = get().projects.find((p) => p.id === sourceId)
        if (!source) return null
        const id = generateId()
        const sessions = source.sessions.map((s) => ({
          ...defaultSession(s.sessionNumber),
          mode: s.mode,
          tools: [...s.tools],
          checklist: s.checklist.map((c) => ({ ...c, done: false })),
          facilitator: s.facilitator,
        }))
        const project = {
          ...source, id, ...overrides,
          createdAt: new Date().toISOString().split('T')[0],
          sourceProjectId: sourceId,
          sessions,
          retrospective: {
            completedAt: null, wentWell: '', improvements: '',
            savedAsTemplate: false, templateId: null,
          },
        }
        set((state) => ({ projects: [...state.projects, project], currentProjectId: id }))
        upsertProject(project)
        return id
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) => p.id === id ? { ...p, ...data } : p),
        }))
        const updated = get().projects.find((p) => p.id === id)
        if (updated) upsertProject(updated)
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        }))
        deleteProjectFromDb(id)
      },

      setCurrentProject: (id) => set({ currentProjectId: id }),

      updateSession: (projectId, sessionNumber, data) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p
            return {
              ...p,
              sessions: p.sessions.map((s) =>
                s.sessionNumber === sessionNumber ? { ...s, ...data } : s
              ),
            }
          }),
        }))
        const project = get().projects.find((p) => p.id === projectId)
        if (project) upsertSessions(projectId, project.sessions)
      },

      updateSessionStatus: (projectId, sessionNumber, status) => {
        get().updateSession(projectId, sessionNumber, { status })
      },

      toggleChecklistItem: (projectId, sessionNumber, itemId) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p
            return {
              ...p,
              sessions: p.sessions.map((s) => {
                if (s.sessionNumber !== sessionNumber) return s
                return {
                  ...s,
                  checklist: s.checklist.map((c) =>
                    c.id === itemId ? { ...c, done: !c.done } : c
                  ),
                }
              }),
            }
          }),
        }))
        const project = get().projects.find((p) => p.id === projectId)
        if (project) upsertSessions(projectId, project.sessions)
      },

      addLiveNote: (projectId, sessionNumber, content) => {
        const note = { id: generateId(), timestamp: new Date().toISOString(), content }
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p
            return {
              ...p,
              sessions: p.sessions.map((s) => {
                if (s.sessionNumber !== sessionNumber) return s
                return { ...s, liveNotes: [...s.liveNotes, note] }
              }),
            }
          }),
        }))
        const project = get().projects.find((p) => p.id === projectId)
        if (project) upsertSessions(projectId, project.sessions)
      },

      addIncident: (projectId, sessionNumber, issue, response) => {
        const incident = { id: generateId(), timestamp: new Date().toISOString(), issue, response }
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p
            return {
              ...p,
              sessions: p.sessions.map((s) => {
                if (s.sessionNumber !== sessionNumber) return s
                return { ...s, incidents: [...s.incidents, incident] }
              }),
            }
          }),
        }))
        const project = get().projects.find((p) => p.id === projectId)
        if (project) upsertSessions(projectId, project.sessions)
      },

      updateTimelineItemStatus: (projectId, sessionNumber, itemIndex, status) => {
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p
            return {
              ...p,
              sessions: p.sessions.map((s) => {
                if (s.sessionNumber !== sessionNumber) return s
                const timeline = [...s.timeline]
                timeline[itemIndex] = { ...timeline[itemIndex], status }
                return { ...s, timeline }
              }),
            }
          }),
        }))
        const project = get().projects.find((p) => p.id === projectId)
        if (project) upsertSessions(projectId, project.sessions)
      },

      updateCommonSettings: (projectId, settings) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, commonSettings: { ...p.commonSettings, ...settings } }
              : p
          ),
        }))
        const updated = get().projects.find((p) => p.id === projectId)
        if (updated) upsertProject(updated)
      },

      updateRetrospective: (projectId, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, retrospective: { ...p.retrospective, ...data } }
              : p
          ),
        }))
        const updated = get().projects.find((p) => p.id === projectId)
        if (updated) upsertProject(updated)
      },
    }),
    { name: 'workshop-store' }
  )
)

export default useWorkshopStore
