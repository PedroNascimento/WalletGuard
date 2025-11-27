-- Script SIMPLIFICADO para adicionar apenas a coluna balance
-- Execute este script se as políticas RLS já existirem

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

-- 4. Verificar se as colunas foram adicionadas
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'banks' 
ORDER BY ordinal_position;

-- Resultado esperado: você deve ver as colunas 'balance' e 'updated_at'
