import { supabase, isSupabaseEnabled } from './supabase'

// DB 컬럼명 ↔ JS 객체 변환 헬퍼
const toDbProject = (p) => ({
  id: p.id,
  name: p.name,
  client: p.client || '',
  manager: p.manager || '',
  manager_title: p.managerTitle || '',
  manager_email: p.managerEmail || '',
  manager_phone: p.managerPhone || '',
  total_sessions: p.totalSessions,
  type: p.type || '',
  memo: p.memo || '',
  created_at: p.createdAt,
  template_id: p.templateId || null,
  source_project_id: p.sourceProjectId || null,
  common_checklist: p.commonSettings?.commonChecklist || [],
  report_deadline: p.commonSettings?.taxInvoiceDate || p.commonSettings?.reportDeadline || '',
  share_link_id: p.share?.linkId || null,
  share_is_public: p.share?.isPublic || false,
  share_expires_at: p.share?.expiresAt || null,
  alerts: p.alerts || [],
  retro_completed_at: p.retrospective?.completedAt || null,
  retro_went_well: p.retrospective?.wentWell || '',
  retro_improvements: p.retrospective?.improvements || '',
  retro_saved_as_template: p.retrospective?.savedAsTemplate || false,
  retro_template_id: p.retrospective?.templateId || null,
})

const fromDbProject = (row, sessions = []) => ({
  id: row.id,
  name: row.name,
  client: row.client,
  manager: row.manager,
  managerTitle: row.manager_title || '',
  managerEmail: row.manager_email || '',
  managerPhone: row.manager_phone || '',
  totalSessions: row.total_sessions,
  type: row.type,
  memo: row.memo,
  createdAt: row.created_at,
  templateId: row.template_id,
  sourceProjectId: row.source_project_id,
  commonSettings: {
    commonChecklist: row.common_checklist || [],
    taxInvoiceDate: row.report_deadline || '',
    reportDeadline: row.report_deadline || '',
  },
  share: {
    linkId: row.share_link_id,
    isPublic: row.share_is_public,
    expiresAt: row.share_expires_at,
  },
  alerts: row.alerts || [],
  retrospective: {
    completedAt: row.retro_completed_at,
    wentWell: row.retro_went_well,
    improvements: row.retro_improvements,
    savedAsTemplate: row.retro_saved_as_template,
    templateId: row.retro_template_id,
  },
  sessions,
})

const toDbSession = (s, projectId) => ({
  project_id: projectId,
  session_number: s.sessionNumber,
  date: s.date || null,
  end_date: s.endDate || null,
  start_time: s.startTime || null,
  end_time: s.endTime || null,
  venue: s.venue || '',
  expected_participants: parseInt(s.expectedParticipants) || null,
  actual_participants: s.actualParticipants,
  participant_delta: s.participantDelta,
  delta_reason: s.deltaReason || '',
  mode: s.mode || '대면',
  tools: s.tools || [],
  checklist: s.checklist || [],
  facilitator: s.facilitator || '',
  status: s.status || '준비중',
  notes: s.notes || '',
  summary: s.summary || '',
  timeline: s.timeline || [],
  live_notes: s.liveNotes || [],
  incidents: s.incidents || [],
})

const fromDbSession = (row) => ({
  sessionNumber: row.session_number,
  date: row.date || '',
  endDate: row.end_date || '',
  startTime: row.start_time || '',
  endTime: row.end_time || '',
  venue: row.venue || '',
  expectedParticipants: row.expected_participants || '',
  actualParticipants: row.actual_participants,
  participantDelta: row.participant_delta,
  deltaReason: row.delta_reason || '',
  mode: row.mode || '대면',
  tools: row.tools || [],
  checklist: row.checklist || [],
  facilitator: row.facilitator || '',
  status: row.status || '준비중',
  notes: row.notes || '',
  summary: row.summary || '',
  timeline: row.timeline || [],
  liveNotes: row.live_notes || [],
  incidents: row.incidents || [],
})

const toDbTemplate = (t) => ({
  id: t.id,
  name: t.name,
  origin_project_id: t.originProjectId || null,
  type: t.type || '',
  client: t.client || '',
  total_sessions: t.totalSessions,
  session_defaults: t.sessionDefaults || [],
  common_checklist: t.commonChecklist || [],
  created_at: t.createdAt,
  usage_count: t.usageCount || 0,
})

const fromDbTemplate = (row) => ({
  id: row.id,
  name: row.name,
  originProjectId: row.origin_project_id,
  type: row.type,
  client: row.client,
  totalSessions: row.total_sessions,
  sessionDefaults: row.session_defaults || [],
  commonChecklist: row.common_checklist || [],
  createdAt: row.created_at,
  usageCount: row.usage_count || 0,
})

// ─── 프로젝트 CRUD ────────────────────────────────────────────────

export async function fetchAllProjects() {
  if (!isSupabaseEnabled) return null
  const { data: projectRows, error: pErr } = await supabase
    .from('projects').select('*').order('inserted_at', { ascending: false })
  if (pErr) { console.error('fetchAllProjects:', pErr); return null }

  const { data: sessionRows, error: sErr } = await supabase
    .from('sessions').select('*').order('session_number')
  if (sErr) { console.error('fetchAllSessions:', sErr); return null }

  return projectRows.map((p) => {
    const sessions = (sessionRows || [])
      .filter((s) => s.project_id === p.id)
      .map(fromDbSession)
    return fromDbProject(p, sessions)
  })
}

export async function upsertProject(project) {
  if (!isSupabaseEnabled) return
  const { error } = await supabase.from('projects').upsert(toDbProject(project))
  if (error) console.error('upsertProject:', error)

  await upsertSessions(project.id, project.sessions || [])
}

export async function upsertSessions(projectId, sessions) {
  if (!isSupabaseEnabled || !sessions.length) return
  const rows = sessions.map((s) => toDbSession(s, projectId))
  const { error } = await supabase.from('sessions').upsert(rows, {
    onConflict: 'project_id,session_number',
  })
  if (error) console.error('upsertSessions:', error)
}

export async function deleteProjectFromDb(projectId) {
  if (!isSupabaseEnabled) return
  const { error } = await supabase.from('projects').delete().eq('id', projectId)
  if (error) console.error('deleteProject:', error)
}

// ─── 템플릿 CRUD ──────────────────────────────────────────────────

export async function fetchAllTemplates() {
  if (!isSupabaseEnabled) return null
  const { data, error } = await supabase.from('templates').select('*').order('created_at', { ascending: false })
  if (error) { console.error('fetchAllTemplates:', error); return null }
  return data.map(fromDbTemplate)
}

export async function upsertTemplate(template) {
  if (!isSupabaseEnabled) return
  const { error } = await supabase.from('templates').upsert(toDbTemplate(template))
  if (error) console.error('upsertTemplate:', error)
}

export async function deleteTemplateFromDb(templateId) {
  if (!isSupabaseEnabled) return
  const { error } = await supabase.from('templates').delete().eq('id', templateId)
  if (error) console.error('deleteTemplate:', error)
}
