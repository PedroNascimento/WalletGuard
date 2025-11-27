# 💳 Setup do Módulo de Cartões

Este guia configura as tabelas necessárias para o módulo de Cartões de Crédito e Gastos.

## 1. Script SQL

Execute o script abaixo no **SQL Editor do Supabase** para criar/atualizar as tabelas e configurar as políticas de segurança (RLS).

```sql
-- 1. Tabela de Cartões (cards)
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  bank_id uuid,
  name text NOT NULL,
  brand text, -- Visa, Mastercard, etc.
  limit_amount numeric(14,2) DEFAULT 0,
  closing_day int CHECK (closing_day BETWEEN 1 AND 31),
  due_day int CHECK (due_day BETWEEN 1 AND 31),
  color text DEFAULT '#000000',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_cards_bank FOREIGN KEY(bank_id) REFERENCES banks(id) ON DELETE SET NULL
);

-- Adicionar coluna color se não existir (para tabelas antigas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'color') THEN
        ALTER TABLE cards ADD COLUMN color text DEFAULT '#000000';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'updated_at') THEN
        ALTER TABLE cards ADD COLUMN updated_at timestamptz DEFAULT now();
    END IF;
END $$;

-- Trigger para updated_at em cards
CREATE OR REPLACE FUNCTION update_cards_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_cards_updated_at();

-- 2. Tabela de Gastos do Cartão (card_expenses)
CREATE TABLE IF NOT EXISTS card_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  card_id uuid NOT NULL,
  value numeric(14,2) NOT NULL,
  category text,
  date date NOT NULL, -- Data da compra (ou da parcela)
  description text,
  installments int DEFAULT 1, -- Total de parcelas
  installment_current int DEFAULT 1, -- Parcela atual (1/10, 2/10...)
  original_amount numeric(14,2), -- Valor total da compra (útil para referência)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_card_expenses_card FOREIGN KEY(card_id) REFERENCES cards(id) ON DELETE CASCADE
);

-- Trigger para updated_at em card_expenses
DROP TRIGGER IF EXISTS update_card_expenses_updated_at ON card_expenses;
CREATE TRIGGER update_card_expenses_updated_at
    BEFORE UPDATE ON card_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_cards_updated_at(); -- Reutilizando a função

-- 3. Configurar RLS (Segurança)

-- Habilitar RLS
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_expenses ENABLE ROW LEVEL SECURITY;

-- Políticas para CARDS
DROP POLICY IF EXISTS cards_select ON cards;
CREATE POLICY cards_select ON cards FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS cards_insert ON cards;
CREATE POLICY cards_insert ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS cards_update ON cards;
CREATE POLICY cards_update ON cards FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS cards_delete ON cards;
CREATE POLICY cards_delete ON cards FOR DELETE USING (auth.uid() = user_id);

-- Políticas para CARD_EXPENSES
DROP POLICY IF EXISTS card_expenses_select ON card_expenses;
CREATE POLICY card_expenses_select ON card_expenses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS card_expenses_insert ON card_expenses;
CREATE POLICY card_expenses_insert ON card_expenses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS card_expenses_update ON card_expenses;
CREATE POLICY card_expenses_update ON card_expenses FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS card_expenses_delete ON card_expenses;
CREATE POLICY card_expenses_delete ON card_expenses FOR DELETE USING (auth.uid() = user_id);

SELECT 'Setup de Cartões concluído com sucesso!' as status;
```

## 2. Verificação

Após executar, verifique se as tabelas `cards` e `card_expenses` estão no seu Table Editor com as colunas corretas.
