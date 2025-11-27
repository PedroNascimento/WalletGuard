-- Script para adicionar coluna balance e configurar RLS na tabela banks
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar coluna balance (saldo)
ALTER TABLE banks 
ADD COLUMN IF NOT EXISTS balance numeric(14,2) DEFAULT 0;

-- 2. Adicionar coluna updated_at
ALTER TABLE banks 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 3. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_banks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_banks_updated_at ON banks;
CREATE TRIGGER update_banks_updated_at
    BEFORE UPDATE ON banks
    FOR EACH ROW
    EXECUTE FUNCTION update_banks_updated_at();

-- 4. Habilitar RLS
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- 5. REMOVER políticas antigas (se existirem)
DROP POLICY IF EXISTS banks_select ON banks;
DROP POLICY IF EXISTS banks_insert ON banks;
DROP POLICY IF EXISTS banks_update ON banks;
DROP POLICY IF EXISTS banks_delete ON banks;

-- 6. Criar políticas RLS

-- Política para SELECT (visualizar apenas próprios bancos)
CREATE POLICY banks_select ON banks FOR SELECT
  USING (auth.uid() = user_id);

-- Política para INSERT (criar apenas com próprio user_id)
CREATE POLICY banks_insert ON banks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (atualizar apenas próprios bancos)
CREATE POLICY banks_update ON banks FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para DELETE (deletar apenas próprios bancos)
CREATE POLICY banks_delete ON banks FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Verificar se as colunas foram adicionadas
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'banks' 
ORDER BY ordinal_position;
