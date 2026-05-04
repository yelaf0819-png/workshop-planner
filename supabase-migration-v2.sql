-- ─────────────────────────────────────────────
-- Migration v2: 신규 필드 추가
-- Supabase SQL Editor에서 실행하세요
-- ─────────────────────────────────────────────

-- projects 테이블: 담당자 상세 정보 추가
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS manager_title TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS manager_email TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS manager_phone TEXT DEFAULT '';

-- sessions 테이블: 종료일(1박 2일 대응) 추가
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS end_date DATE;
