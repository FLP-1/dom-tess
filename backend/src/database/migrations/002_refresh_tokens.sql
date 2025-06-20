002_refresh_tokens.sql
-- Para armazenar refresh tokens por usuário (MFA, controle de sessão)
CREATE TABLE IF NOT EXISTS public.refresh_tokens (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token         TEXT    NOT NULL UNIQUE,
  issued_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked       BOOLEAN NOT NULL DEFAULT FALSE
);
