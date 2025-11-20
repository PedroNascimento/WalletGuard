-- Habilitar extensão para gerar UUIDs (se necessário)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tabela de usuários da aplicação (metadados; sincronize com Supabase Auth)
CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid uuid UNIQUE, -- opcional: armazenar o auth.uid do Supabase Auth
  email text,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Bancos / Instituições
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text,
  color varchar(7),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_banks_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_banks_user ON banks(user_id);

-- Cartões de Crédito
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  bank_id uuid,
  name text NOT NULL,
  brand text,
  limit_amount numeric(14,2) DEFAULT 0,
  closing_day int, -- 1..31
  due_day int,     -- 1..31
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_cards_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cards_bank FOREIGN KEY(bank_id) REFERENCES banks(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_cards_user ON cards(user_id);

-- Receitas (incomes)
CREATE TABLE IF NOT EXISTS incomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  value numeric(14,2) NOT NULL,
  category text,
  date date NOT NULL,
  description text,
  recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_incomes_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_incomes_user_date ON incomes(user_id, date);

-- Despesas gerais (expenses)
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  value numeric(14,2) NOT NULL,
  category text,
  type text, -- 'fixa' ou 'variavel'
  date date NOT NULL,
  description text,
  recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_expenses_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- Despesas de cartão (card_expenses) (suporta parcelamento)
CREATE TABLE IF NOT EXISTS card_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  card_id uuid NOT NULL,
  value numeric(14,2) NOT NULL,
  category text,
  date date NOT NULL, -- data da compra
  description text,
  installments int DEFAULT 1,
  installment_current int DEFAULT 1,
  original_amount numeric(14,2), -- valor total original (opcional)
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_card_expenses_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_card_expenses_card FOREIGN KEY(card_id) REFERENCES cards(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_card_expenses_user_date ON card_expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_card_expenses_card ON card_expenses(card_id);

-- Exemplo de tabelas auxiliares (categorias padronizadas)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL, -- 'income' ou 'expense'
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_categories_user FOREIGN KEY(user_id) REFERENCES app_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- Regras de nível de linha (RLS) — exemplo básico (ativa RLS e aplica policy para cada tabela)
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
CREATE POLICY banks_is_owner ON banks
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY cards_is_owner ON cards
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
CREATE POLICY incomes_is_owner ON incomes
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY expenses_is_owner ON expenses
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

ALTER TABLE card_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY card_expenses_is_owner ON card_expenses
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY categories_is_owner ON categories
  USING (user_id = current_setting('request.jwt.claim.sub', true)::uuid);

-- Índices e views de agregação (exemplos)
CREATE OR REPLACE VIEW vw_monthly_summary AS
SELECT
  user_id,
  date_trunc('month', date::timestamptz)::date AS month,
  SUM(CASE WHEN value IS NOT NULL THEN value ELSE 0 END) FILTER (WHERE true) AS total_amount,
  COUNT(*) AS cnt
FROM (
  SELECT user_id, date, value FROM incomes
  UNION ALL
  SELECT user_id, date, -value FROM expenses
  UNION ALL
  SELECT user_id, date, -value FROM card_expenses
) t
GROUP BY user_id, date_trunc('month', date::timestamptz);
