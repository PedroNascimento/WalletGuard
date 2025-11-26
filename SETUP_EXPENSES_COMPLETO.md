# 🔧 Setup Completo da Tabela Expenses

## ⚠️ IMPORTANTE: Execute TODOS os scripts abaixo no Supabase

O erro **"new row violates row-level security policy"** ocorre porque:
1. A tabela `expenses` não tem políticas RLS configuradas, OU
2. As colunas `recurring_frequency` e `notes` não existem

---

## 📋 Solução Completa

Execute os 2 scripts SQL abaixo **na ordem** no SQL Editor do Supabase.

### Passo 1: Acessar o SQL Editor

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto **WalletGuard**
3. No menu lateral esquerdo, clique em **SQL Editor**

---

### Passo 2: Script 1 - Adicionar Colunas Faltantes

Copie e cole este script e clique em **Run**:

```sql
-- Adicionar colunas faltantes na tabela expenses

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

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expenses_updated_at();

SELECT 'Colunas adicionadas com sucesso!' AS status;
```

---

### Passo 3: Script 2 - Configurar RLS (Row Level Security)

Copie e cole este script e clique em **Run**:

```sql
-- Configurar Row Level Security na tabela expenses

-- Habilitar RLS
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

SELECT 'RLS configurado com sucesso!' AS status;
```

---

### Passo 4: Verificar

Execute este script para verificar se tudo foi configurado corretamente:

```sql
-- Verificar colunas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'expenses' 
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies
WHERE tablename = 'expenses';
```

Você deve ver:
- ✅ Colunas: `recurring_frequency`, `notes`, `updated_at`
- ✅ Políticas: `expenses_select`, `expenses_insert`, `expenses_update`, `expenses_delete`

---

## 🧪 Teste

Após executar os scripts:

1. Volte para a aplicação WalletGuard
2. **Recarregue a página** (F5 ou Ctrl+R)
3. Faça login
4. Vá em **Despesas**
5. Clique em **Nova Despesa**
6. Preencha o formulário:
   - Descrição: "Teste RLS"
   - Valor: 50
   - Data: Data atual
   - Categoria: Alimentação
   - Tipo: Variável
   - Marque "Despesa recorrente"
   - Frequência: Mensal
   - Observações: "Teste de políticas RLS"
7. Clique em **Criar Despesa**
8. ✅ **A despesa deve ser criada com sucesso!**

---

## 📊 Estrutura Final

### Colunas da Tabela `expenses`

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | uuid | Sim | ID único (gerado automaticamente) |
| `user_id` | uuid | Sim | ID do usuário (injetado automaticamente) |
| `value` | numeric(14,2) | Sim | Valor da despesa |
| `category` | text | Não | Categoria |
| `type` | text | Não | Tipo (fixa/variavel) |
| `date` | date | Sim | Data da despesa |
| `description` | text | Não | Descrição |
| `recurring` | boolean | Não | Se é recorrente (padrão: false) |
| `recurring_frequency` | text | Não | **NOVA** - Frequência (semanal/mensal/anual) |
| `notes` | text | Não | **NOVA** - Observações |
| `created_at` | timestamptz | Sim | Data de criação (automático) |
| `updated_at` | timestamptz | Sim | **NOVA** - Data de atualização (automático) |

### Políticas RLS

| Política | Operação | Regra |
|----------|----------|-------|
| `expenses_select` | SELECT | `auth.uid() = user_id` |
| `expenses_insert` | INSERT | `auth.uid() = user_id` |
| `expenses_update` | UPDATE | `auth.uid() = user_id` |
| `expenses_delete` | DELETE | `auth.uid() = user_id` |

---

## 🔒 Segurança

Com as políticas RLS configuradas:

- ✅ Cada usuário vê **apenas suas próprias despesas**
- ✅ Não é possível criar despesas para outros usuários
- ✅ Não é possível editar despesas de outros usuários
- ✅ Não é possível deletar despesas de outros usuários
- ✅ O `user_id` é validado automaticamente pelo Supabase

---

## ❌ Erros Comuns

### Erro: "new row violates row-level security policy"
**Causa:** Políticas RLS não configuradas  
**Solução:** Execute o Script 2 (RLS)

### Erro: "column 'recurring_frequency' does not exist"
**Causa:** Colunas não adicionadas  
**Solução:** Execute o Script 1 (Colunas)

### Erro: "permission denied for table expenses"
**Causa:** RLS habilitado mas sem políticas  
**Solução:** Execute o Script 2 (RLS)

---

## 📁 Arquivos dos Scripts

Os scripts também estão disponíveis em:
- `supabase/add-expenses-columns.sql` - Script 1
- `supabase/add-expenses-rls.sql` - Script 2

---

## ✅ Checklist

- [ ] Executei o Script 1 (Colunas)
- [ ] Executei o Script 2 (RLS)
- [ ] Verifiquei que as colunas foram criadas
- [ ] Verifiquei que as 4 políticas RLS foram criadas
- [ ] Recarreguei a página da aplicação
- [ ] Testei criar uma despesa
- [ ] A despesa foi criada com sucesso

---

**Após executar os 2 scripts, o módulo de Despesas estará 100% funcional e seguro!** 🚀🔒
