# 🏦 Setup da Tabela Banks - WalletGuard

## ⚠️ IMPORTANTE: Execute este script ANTES de usar o módulo de Bancos

---

## Problema Identificado

A tabela `banks` do Supabase não possui as colunas:
- `balance` - Saldo da conta
- `updated_at` - Data de atualização

Além disso, as políticas RLS não estão configuradas.

Isso causa o erro: **"Could not find the 'balance' column of 'banks' in the schema cache"**

---

## Solução Completa

Execute o script SQL abaixo no **SQL Editor do Supabase**.

### Passo 1: Acessar o SQL Editor

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto **WalletGuard**
3. No menu lateral esquerdo, clique em **SQL Editor**

### Passo 2: Executar o Script

Copie e cole o script abaixo no SQL Editor e clique em **Run**:

```sql
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

-- 5. Remover políticas antigas se existirem
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
```

### Passo 3: Verificar

Após executar o script, você deve ver:

#### Colunas da Tabela:
- ✅ `id` (uuid)
- ✅ `user_id` (uuid)
- ✅ `name` (text)
- ✅ `type` (text)
- ✅ `color` (varchar)
- ✅ `balance` (numeric) **NOVA**
- ✅ `created_at` (timestamptz)
- ✅ `updated_at` (timestamptz) **NOVA**

#### Políticas RLS:
- ✅ `banks_select`
- ✅ `banks_insert`
- ✅ `banks_update`
- ✅ `banks_delete`

---

## 📊 Estrutura Final da Tabela

| Coluna | Tipo | Obrigatório | Padrão | Descrição |
|--------|------|-------------|--------|-----------|
| `id` | uuid | Sim | gen_random_uuid() | ID único |
| `user_id` | uuid | Sim | - | ID do usuário |
| `name` | text | Sim | - | Nome do banco |
| `type` | text | Não | - | Tipo (corrente/poupanca/investimento) |
| `color` | varchar(7) | Não | - | Cor para gráficos (hex) |
| `balance` | numeric(14,2) | Não | 0 | **NOVA** - Saldo |
| `created_at` | timestamptz | Sim | now() | Data de criação |
| `updated_at` | timestamptz | Sim | now() | **NOVA** - Data de atualização |

---

## 🔒 Políticas RLS

| Política | Operação | Regra |
|----------|----------|-------|
| `banks_select` | SELECT | `auth.uid() = user_id` |
| `banks_insert` | INSERT | `auth.uid() = user_id` |
| `banks_update` | UPDATE | `auth.uid() = user_id` |
| `banks_delete` | DELETE | `auth.uid() = user_id` |

---

## 🧪 Teste

Após executar o script:

1. **Recarregue a página** da aplicação (F5 ou Ctrl+R)
2. Faça login
3. Vá em **Bancos**
4. Clique em **Novo Banco**
5. Preencha o formulário:
   - Nome: "Nubank"
   - Tipo: Conta Corrente
   - Cor: Roxo
   - Saldo Inicial: 1000
6. Clique em **Criar Banco**
7. ✅ **O banco deve ser criado com sucesso!**

---

## ❌ Erros Comuns

### Erro: "Could not find the 'balance' column"
**Causa:** Coluna `balance` não existe  
**Solução:** Execute o script SQL acima

### Erro: "new row violates row-level security policy"
**Causa:** Políticas RLS não configuradas  
**Solução:** Execute a parte de RLS do script (passos 4-6)

### Erro: "permission denied for table banks"
**Causa:** RLS habilitado mas sem políticas  
**Solução:** Execute o script completo

---

## 📁 Arquivo do Script

O script também está disponível em:
`supabase/setup-banks.sql`

---

## ✅ Checklist

- [ ] Executei o script SQL no Supabase
- [ ] Verifiquei que a coluna `balance` foi criada
- [ ] Verifiquei que a coluna `updated_at` foi criada
- [ ] Verifiquei que as 4 políticas RLS foram criadas
- [ ] Recarreguei a página da aplicação
- [ ] Testei criar um banco
- [ ] O banco foi criado com sucesso

---

## 🔗 Relacionamentos

### Cartões (cards)
- A tabela `cards` tem uma foreign key `bank_id` que referencia `banks(id)`
- Comportamento: `ON DELETE SET NULL`
- Ao deletar um banco, os cartões associados terão `bank_id = NULL`

---

## 📝 Notas Importantes

1. **Saldo Inicial:** O campo `balance` é opcional e tem valor padrão `0`
2. **Atualização Automática:** O campo `updated_at` é atualizado automaticamente via trigger
3. **Cores:** O campo `color` aceita cores em formato hexadecimal (#RRGGBB)
4. **Tipos de Conta:** Valores sugeridos: 'corrente', 'poupanca', 'investimento'

---

**Após executar o script, o módulo de Bancos estará 100% funcional!** 🏦🚀
