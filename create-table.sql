-- 🗂️ Script para criar tabela submission_queue no Supabase
-- Copie e execute em: Supabase Dashboard → SQL Editor → New Query

CREATE TABLE submission_queue (
  id BIGSERIAL PRIMARY KEY,
  form_data JSONB NOT NULL,
  phone_destination TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  attempts INTEGER DEFAULT 0,
  error_message TEXT,
  last_error_at TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_status ON submission_queue(status);
CREATE INDEX idx_created ON submission_queue(created_at);

-- Ativar Row Level Security
ALTER TABLE submission_queue ENABLE ROW LEVEL SECURITY;

-- Política 1: Clientes podem INSERT (salvar formulários)
CREATE POLICY "Clients can insert submissions"
  ON submission_queue
  FOR INSERT
  WITH CHECK (true);

-- Política 2: Apenas service_role pode SELECT (processador)
CREATE POLICY "Service role only for select"
  ON submission_queue
  FOR SELECT
  USING (
    auth.role() = 'service_role'
  );

-- Verificar se foi criada
SELECT * FROM submission_queue LIMIT 1;
