// 004_tasks.sql
-- Tarefas colaborativas
CREATE TABLE IF NOT EXISTS public.tasks (
  id             SERIAL PRIMARY KEY,
  title          VARCHAR(200) NOT NULL,
  description    TEXT,
  creator_id     INTEGER NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  assignee_id    INTEGER REFERENCES public.users(id),
  status         VARCHAR(20) NOT NULL DEFAULT 'open',  -- 'open','in_progress','done','canceled'
  priority       SMALLINT NOT NULL DEFAULT 2,          -- 1=alta,2=média,3=baixa
  due_date       DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
