# 🚀 Guia Rápido: Criar Tabela Receitas no Supabase

## ⚠️ IMPORTANTE: Execute este script ANTES de usar a funcionalidade de Receitas

---

## Passo 1: Acessar o SQL Editor do Supabase

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto **WalletGuard**
3. No menu lateral esquerdo, clique em **SQL Editor**

---

## Passo 2: Executar o Script SQL

### Opção A: Script Completo (Recomendado se for a primeira vez)

1. Abra o arquivo `supabase/schema.sql`
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Opção B: Apenas Tabela Receitas (Se outras tabelas já existem)

1. Abra o arquivo `supabase/add-receitas-table.sql`
2. Copie **TODO** o conteúdo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter`)

---

## Script para Copiar (Tabela Receitas)

```sql
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
  CONSTRAINT fk_receitas_user FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Criar índices para otimização
CREATE INDEX IF NOT EXISTS idx_receitas_user_date ON receitas(user_id, data);
CREATE INDEX IF NOT EXISTS idx_receitas_categoria ON receitas(user_id, categoria);

-- Habilitar RLS (Row Level Security)
ALTER TABLE receitas ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (visualizar apenas próprias receitas)
CREATE POLICY receitas_select ON receitas FOR SELECT
  USING (auth.uid() = user_id);

-- Política para INSERT (criar apenas com próprio user_id)
CREATE POLICY receitas_insert ON receitas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (atualizar apenas próprias receitas)
CREATE POLICY receitas_update ON receitas FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para DELETE (deletar apenas próprias receitas)
CREATE POLICY receitas_delete ON receitas FOR DELETE
  USING (auth.uid() = user_id);

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
```

---

## Passo 3: Verificar se a Tabela foi Criada

1. No Supabase, vá em **Table Editor** (menu lateral)
2. Procure pela tabela **receitas**
3. Você deve ver as seguintes colunas:
   - `id` (uuid)
   - `user_id` (uuid)
   - `descricao` (text)
   - `valor` (numeric)
   - `data` (date)
   - `categoria` (text)
   - `recorrente` (boolean)
   - `frequencia_recorrencia` (text)
   - `observacoes` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

---

## Passo 4: Verificar RLS (Row Level Security)

1. No Table Editor, clique na tabela **receitas**
2. Clique na aba **Policies** (ou **RLS**)
3. Você deve ver 4 políticas:
   - ✅ `receitas_select` - SELECT
   - ✅ `receitas_insert` - INSERT
   - ✅ `receitas_update` - UPDATE
   - ✅ `receitas_delete` - DELETE

---

## Passo 5: Testar a Criação de Receita

1. Volte para a aplicação WalletGuard
2. Faça login
3. Vá em **Receitas**
4. Clique em **Nova Receita**
5. Preencha o formulário:
   - Descrição: "Teste"
   - Valor: 100
   - Data: Data atual
   - Categoria: Salário
6. Clique em **Criar Receita**
7. ✅ A receita deve ser criada com sucesso!

---

## ⚠️ Problemas Comuns

### Erro: "relation 'app_users' does not exist"

**Solução:** Execute o script completo `supabase/schema.sql` que cria todas as tabelas, incluindo `app_users`.

### Erro: "permission denied for table receitas"

**Solução:** Verifique se as políticas RLS foram criadas corretamente. Execute novamente a parte de RLS do script.

### Erro: "Could not find the table 'public.receitas'"

**Solução:** A tabela não foi criada. Execute o script novamente e verifique se não há erros no console do SQL Editor.

---

## 📝 Observação Importante

**ATENÇÃO:** O campo `user_id` na tabela `receitas` referencia `auth.users(id)` do Supabase Auth, NÃO a tabela `app_users`.

Se você quiser usar a tabela `app_users` como referência, altere a linha:

```sql
-- DE:
CONSTRAINT fk_receitas_user FOREIGN KEY(user_id) REFERENCES auth.users(id) ON DELETE CASCADE

-- PARA:
CONSTRAINT fk_receitas_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
```

Mas recomendo manter `auth.users(id)` pois é a tabela nativa do Supabase Auth.

---

## ✅ Checklist

- [ ] Acessei o SQL Editor do Supabase
- [ ] Executei o script SQL
- [ ] Verifiquei que a tabela `receitas` foi criada
- [ ] Verifiquei que as 4 políticas RLS foram criadas
- [ ] Testei criar uma receita na aplicação
- [ ] A receita foi criada com sucesso

---

**Após executar o script, a funcionalidade de Receitas estará 100% operacional!** 🚀
