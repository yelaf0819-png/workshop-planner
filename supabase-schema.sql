-- Workshop Planner 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 프로젝트 테이블
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT,
  manager TEXT,
  total_sessions INTEGER DEFAULT 1,
  type TEXT,
  memo TEXT,
  created_at TEXT,
  template_id TEXT,
  source_project_id TEXT,
  common_checklist JSONB DEFAULT '[]',
  report_deadline TEXT,
  share_link_id TEXT,
  share_is_public BOOLEAN DEFAULT false,
  share_expires_at TEXT,
  alerts JSONB DEFAULT '[]',
  retro_completed_at TEXT,
  retro_went_well TEXT,
  retro_improvements TEXT,
  retro_saved_as_template BOOLEAN DEFAULT false,
  retro_template_id TEXT,
  inserted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 차수(세션) 테이블
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  venue TEXT,
  expected_participants INTEGER,
  actual_participants INTEGER,
  participant_delta INTEGER,
  delta_reason TEXT,
  mode TEXT DEFAULT '대면',
  tools JSONB DEFAULT '[]',
  checklist JSONB DEFAULT '[]',
  facilitator TEXT,
  status TEXT DEFAULT '준비중',
  notes TEXT,
  summary TEXT,
  timeline JSONB DEFAULT '[]',
  live_notes JSONB DEFAULT '[]',
  incidents JSONB DEFAULT '[]',
  UNIQUE(project_id, session_number)
);

-- 템플릿 테이블
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  origin_project_id TEXT,
  type TEXT,
  client TEXT,
  total_sessions INTEGER,
  session_defaults JSONB DEFAULT '[]',
  common_checklist JSONB DEFAULT '[]',
  created_at TEXT,
  usage_count INTEGER DEFAULT 0
);

-- RLS(Row Level Security) 비활성화 (MVP - 인증 없이 전체 접근)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 읽기/쓰기 허용 정책 (MVP용)
CREATE POLICY "public_all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all" ON templates FOR ALL USING (true) WITH CHECK (true);
