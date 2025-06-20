// 006_purchases.sql
-- Lista de compras
CREATE TABLE IF NOT EXISTS public.purchases (
  id               SERIAL PRIMARY KEY,
  requester_id     INTEGER NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  group_name       VARCHAR(100) NOT NULL DEFAULT 'default',
  product          VARCHAR(200) NOT NULL,
  brand_model      VARCHAR(200),
  photo_url        TEXT,
  last_price       DECIMAL(10,2),
  unit             VARCHAR(10),
  quantity         DECIMAL(10,2) NOT NULL DEFAULT 1,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.purchases(requester_id);
CREATE INDEX ON public.purchases(group_name);
