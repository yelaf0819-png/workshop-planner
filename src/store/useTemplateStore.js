import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  fetchAllTemplates,
  upsertTemplate,
  deleteTemplateFromDb,
} from '../lib/syncService'

const generateId = () => Math.random().toString(36).substr(2, 9)

const useTemplateStore = create(
  persist(
    (set, get) => ({
      templates: [],

      syncFromSupabase: async () => {
        const remote = await fetchAllTemplates()
        if (remote && remote.length > 0) {
          set({ templates: remote })
        }
      },

      saveTemplate: (project, name) => {
        const id = generateId()
        const template = {
          id,
          name: name || project.name + ' 템플릿',
          originProjectId: project.id,
          type: project.type,
          client: project.client,
          totalSessions: project.totalSessions,
          sessionDefaults: project.sessions.map((s) => ({
            sessionNumber: s.sessionNumber,
            mode: s.mode,
            tools: [...s.tools],
            checklist: s.checklist.map((c) => ({ ...c, done: false })),
            facilitator: s.facilitator,
            timeline: s.timeline.map((t) => ({ ...t, status: '대기' })),
          })),
          commonChecklist: project.commonSettings?.commonChecklist || [],
          createdAt: new Date().toISOString().split('T')[0],
          usageCount: 0,
        }
        set((state) => ({ templates: [...state.templates, template] }))
        upsertTemplate(template)
        return id
      },

      deleteTemplate: (id) => {
        set((state) => ({ templates: state.templates.filter((t) => t.id !== id) }))
        deleteTemplateFromDb(id)
      },

      incrementUsage: (id) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t
          ),
        }))
        const t = get().templates.find((t) => t.id === id)
        if (t) upsertTemplate(t)
      },

      getTemplateById: (id) => get().templates.find((t) => t.id === id),
    }),
    { name: 'template-store' }
  )
)

export default useTemplateStore
