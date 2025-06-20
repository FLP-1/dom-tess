// 005_documents.sql
-- Gestão de documentos (upload, validade, alertas)
CREATE TABLE IF NOT EXISTS public.documents (
  id             SERIAL PRIMARY KEY,
  owner_id       INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  filename       VARCHAR(255) NOT NULL,
  file_url       TEXT NOT NULL,
  category       VARCHAR(50),
  expires_at     DATE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
