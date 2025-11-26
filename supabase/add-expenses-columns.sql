-- Script para adicionar colunas faltantes na tabela expenses
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna de frequência de recorrência
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS recurring_frequency text 
CHECK (recurring_frequency IN ('semanal', 'mensal', 'anual'));

-- Adicionar coluna de observações
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS notes text;

-- Adicionar coluna de updated_at
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expenses_updated_at();

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'expenses' 
ORDER BY ordinal_position;
