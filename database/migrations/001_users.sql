// 001_users.sql
-- Cria tabela de usuários e perfis
CREATE TABLE IF NOT EXISTS public.users (
  id              SERIAL PRIMARY KEY,
  cpf             VARCHAR(11)  NOT NULL UNIQUE,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  phone           VARCHAR(20),
  password_hash   TEXT         NOT NULL,
  role            VARCHAR(20)  NOT NULL,          -- 'employer','employee','family','partner','admin'
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

