-- Script para adicionar a tabela RECEITAS ao banco de dados
-- Execute este script no SQL Editor do Supabase

-- Criar tabela receitas
CREATE TABLE IF NOT EXISTS receitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  descricao text NOT NULL,
  valor numeric(14,2) NOT NULL,
  data date NOT NULL,
  categoria text NOT NULL,
  recorrente boolean DEFAULT false,
  frequencia_recorrencia text CHECK (frequencia_recorrencia IN ('semanal', 'mensal', 'anual')),
  observacoes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_receitas_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

-- Criar índices para otimização
CREATE INDEX IF NOT EXISTS idx_receitas_user_date ON receitas(user_id, data);
CREATE INDEX IF NOT EXISTS idx_receitas_categoria ON receitas(user_id, categoria);

-- Habilitar RLS (Row Level Security)
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (visualizar apenas próprias receitas)
CREATE POLICY receitas_select ON receitas FOR SELECT
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

-- Política para INSERT (criar apenas com próprio user_id)
CREATE POLICY receitas_insert ON receitas FOR INSERT
  WITH CHECK (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

-- Política para UPDATE (atualizar apenas próprias receitas)
CREATE POLICY receitas_update ON receitas FOR UPDATE
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

-- Política para DELETE (deletar apenas próprias receitas)
CREATE POLICY receitas_delete ON receitas FOR DELETE
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_receitas_updated_at
    BEFORE UPDATE ON receitas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar se a tabela foi criada
SELECT 'Tabela receitas criada com sucesso!' AS status;
