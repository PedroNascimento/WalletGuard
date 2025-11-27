# 🔧 Correção de Problemas de Exclusão (DELETE)

Se você está tentando excluir Receitas, Despesas ou Bancos e nada acontece (ou recebe erro), siga este guia.

## Causa Provável

1. **Políticas de Segurança (RLS) Incorretas:** O banco de dados pode estar impedindo a exclusão.
2. **Registro sem Dono:** O registro que você está tentando excluir pode não ter seu `user_id` (criado antes da correção de bugs).

---

## 🛠️ Solução: Script de Correção

Execute o script abaixo no **SQL Editor do Supabase** para garantir que você tem permissão para excluir seus dados.

### Passo 1: Acessar SQL Editor
1. Vá para https://supabase.com/dashboard
2. Selecione seu projeto **WalletGuard**
3. Clique em **SQL Editor**

### Passo 2: Executar Script

Copie e cole o código abaixo e clique em **Run**:

```sql
-- Script para corrigir permissões de DELETE e registros órfãos

-- 1. Reforçar políticas de DELETE para RECEITAS
DROP POLICY IF EXISTS receitas_delete ON receitas;
CREATE POLICY receitas_delete ON receitas FOR DELETE USING (auth.uid() = user_id);

-- 2. Reforçar políticas de DELETE para DESPESAS
DROP POLICY IF EXISTS expenses_delete ON expenses;
CREATE POLICY expenses_delete ON expenses FOR DELETE USING (auth.uid() = user_id);

-- 3. Reforçar políticas de DELETE para BANCOS
DROP POLICY IF EXISTS banks_delete ON banks;
CREATE POLICY banks_delete ON banks FOR DELETE USING (auth.uid() = user_id);

-- 4. Verificar se as políticas foram criadas
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE cmd = 'DELETE' 
  AND tablename IN ('receitas', 'expenses', 'banks');

-- 5. (OPCIONAL) Verificar registros sem dono (user_id NULL)
-- Se aparecer algum registro aqui, ele não poderá ser excluído pela aplicação
SELECT 'receitas' as tabela, count(*) as orfaos FROM receitas WHERE user_id IS NULL
UNION ALL
SELECT 'expenses' as tabela, count(*) as orfaos FROM expenses WHERE user_id IS NULL
UNION ALL
SELECT 'banks' as tabela, count(*) as orfaos FROM banks WHERE user_id IS NULL;
```

---

## 🚨 Se houver registros órfãos (user_id NULL)

Se o resultado do passo 5 mostrar números maiores que 0, execute este comando para atribuir esses registros a você (apenas para ambiente de desenvolvimento):

**ATENÇÃO:** Substitua `SEU_ID_DE_USUARIO` pelo seu UUID (você pode ver na tabela `auth.users` ou no console do navegador `localStorage`).

```sql
-- Exemplo (substitua pelo seu ID real):
-- UPDATE receitas SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
-- UPDATE expenses SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
-- UPDATE banks SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
```

Ou simplesmente delete-os via SQL:

```sql
DELETE FROM receitas WHERE user_id IS NULL;
DELETE FROM expenses WHERE user_id IS NULL;
DELETE FROM banks WHERE user_id IS NULL;
```

---

## ✅ Teste

Após executar o script:
1. Recarregue a página da aplicação (F5)
2. Tente excluir o item novamente.
3. Se falhar, você verá uma mensagem de erro mais clara agora ("Erro ao excluir: Registro não encontrado ou sem permissão").
