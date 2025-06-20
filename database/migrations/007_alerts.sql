// 007_alerts.sql
-- Alertas configuráveis e disparos
CREATE TABLE IF NOT EXISTS public.alerts (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type           VARCHAR(50) NOT NULL,  -- 'point_missing','doc_expiring','custom'
  message        TEXT NOT NULL,
  scheduled_for  TIMESTAMPTZ NOT NULL,
  sent           BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.alerts(user_id);
CREATE INDEX ON public.alerts(scheduled_for);
