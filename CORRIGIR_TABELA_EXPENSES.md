# 🔧 Correção: Adicionar Colunas Faltantes na Tabela Expenses

## ⚠️ IMPORTANTE: Execute este script ANTES de usar o módulo de Despesas

---

## Problema Identificado

A tabela `expenses` do Supabase não possui as colunas:
- `recurring_frequency` - Frequência de recorrência
- `notes` - Observações
- `updated_at` - Data de atualização

Isso causa erro ao tentar criar despesas com recorrência ou observações.

---

## Solução

Execute o script SQL abaixo no **SQL Editor do Supabase**.

### Passo 1: Acessar o SQL Editor

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto **WalletGuard**
3. No menu lateral esquerdo, clique em **SQL Editor**

### Passo 2: Executar o Script

Copie e cole o script abaixo no SQL Editor e clique em **Run**:

```sql
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
```

### Passo 3: Verificar

Após executar o script, você deve ver uma lista de colunas incluindo:
- ✅ `recurring_frequency` (text)
- ✅ `notes` (text)
- ✅ `updated_at` (timestamp with time zone)

---

## Estrutura Final da Tabela

Após a migração, a tabela `expenses` terá:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | uuid | ID único |
| `user_id` | uuid | ID do usuário |
| `value` | numeric | Valor |
| `category` | text | Categoria |
| `type` | text | Tipo (fixa/variavel) |
| `date` | date | Data |
| `description` | text | Descrição |
| `recurring` | boolean | Recorrente |
| `recurring_frequency` | text | **NOVA** - Frequência |
| `notes` | text | **NOVA** - Observações |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | **NOVA** - Data de atualização |

---

## Mapeamento de Campos

O service faz o mapeamento automático:

| Aplicação (PT) | Banco (EN) |
|----------------|------------|
| `descricao` | `description` |
| `valor` | `value` |
| `data` | `date` |
| `categoria` | `category` |
| `tipo` | `type` |
| `recorrente` | `recurring` |
| `frequencia_recorrencia` | `recurring_frequency` |
| `observacoes` | `notes` |

---

## Teste

Após executar o script:

1. Volte para a aplicação WalletGuard
2. Faça login
3. Vá em **Despesas**
4. Clique em **Nova Despesa**
5. Preencha o formulário:
   - Descrição: "Teste"
   - Valor: 100
   - Data: Data atual
   - Categoria: Impostos
   - Tipo: Fixa
   - ✅ Marque "Despesa recorrente"
   - Frequência: Mensal
   - Observações: "Teste de recorrência"
6. Clique em **Criar Despesa**
7. ✅ A despesa deve ser criada com sucesso!

---

## Alternativa: Usar Campos Existentes

Se você **não quiser** executar o script SQL, pode:

1. **Não usar** a funcionalidade de recorrência
2. **Não adicionar** observações
3. As despesas básicas funcionarão normalmente

Mas recomendamos **executar o script** para ter a funcionalidade completa.

---

## Arquivo do Script

O script também está disponível em:
`supabase/add-expenses-columns.sql`

---

**Após executar o script, o módulo de Despesas estará 100% funcional!** 🚀
