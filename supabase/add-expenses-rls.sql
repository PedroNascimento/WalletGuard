-- Script para adicionar políticas RLS na tabela expenses
-- Execute este script no SQL Editor do Supabase

-- Habilitar RLS na tabela expenses (se ainda não estiver habilitado)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS expenses_select ON expenses;
DROP POLICY IF EXISTS expenses_insert ON expenses;
DROP POLICY IF EXISTS expenses_update ON expenses;
DROP POLICY IF EXISTS expenses_delete ON expenses;

-- Política para SELECT (visualizar apenas próprias despesas)
CREATE POLICY expenses_select ON expenses FOR SELECT
  USING (auth.uid() = user_id);

-- Política para INSERT (criar apenas com próprio user_id)
CREATE POLICY expenses_insert ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (atualizar apenas próprias despesas)
CREATE POLICY expenses_update ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para DELETE (deletar apenas próprias despesas)
CREATE POLICY expenses_delete ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'expenses';
