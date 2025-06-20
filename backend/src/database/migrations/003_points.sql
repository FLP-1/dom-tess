// 003_points.sql
-- Registro de ponto inteligente
CREATE TABLE IF NOT EXISTS public.points (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event            VARCHAR(30) NOT NULL,  -- 'entry','break_start','break_end','exit','ot_start','ot_end'
  timestamp        TIMESTAMPTZ NOT NULL DEFAULT now(),
  latitude         DECIMAL(9,6),
  longitude        DECIMAL(9,6),
  wifi_ssid        VARCHAR(100),
  status           VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'ok','late','absent','pending'
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.points(user_id);
CREATE INDEX ON public.points(timestamp);

