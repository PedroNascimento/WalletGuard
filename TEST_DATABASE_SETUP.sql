-- =====================================================
-- WALLETGUARD - SETUP DE BANCO DE DADOS DE TESTE
-- =====================================================
-- Execute este script no SQL Editor do Supabase
-- para criar todas as tabelas e configurações necessárias
-- =====================================================

-- 1. TABELA DE USUÁRIOS (app_users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para app_users
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.app_users;
CREATE POLICY "Users can view own profile" ON public.app_users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.app_users;
CREATE POLICY "Users can update own profile" ON public.app_users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.app_users;
CREATE POLICY "Users can insert own profile" ON public.app_users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. TABELA DE RECEITAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.receitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    type TEXT DEFAULT 'fixa',
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia_recorrencia TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para receitas
CREATE INDEX IF NOT EXISTS idx_receitas_user_id ON public.receitas(user_id);
CREATE INDEX IF NOT EXISTS idx_receitas_date ON public.receitas(date);
CREATE INDEX IF NOT EXISTS idx_receitas_category ON public.receitas(category);

-- RLS para receitas
ALTER TABLE public.receitas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own receitas" ON public.receitas;
CREATE POLICY "Users can view own receitas" ON public.receitas
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own receitas" ON public.receitas;
CREATE POLICY "Users can insert own receitas" ON public.receitas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own receitas" ON public.receitas;
CREATE POLICY "Users can update own receitas" ON public.receitas
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own receitas" ON public.receitas;
CREATE POLICY "Users can delete own receitas" ON public.receitas
    FOR DELETE USING (auth.uid() = user_id);

-- 3. TABELA DE DESPESAS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    type TEXT DEFAULT 'variavel',
    recorrente BOOLEAN DEFAULT FALSE,
    frequencia_recorrencia TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Renomear coluna se necessário (compatibilidade)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'expenses' AND column_name = 'descricao') THEN
        ALTER TABLE public.expenses RENAME COLUMN descricao TO description;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'expenses' AND column_name = 'valor') THEN
        ALTER TABLE public.expenses RENAME COLUMN valor TO value;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'expenses' AND column_name = 'data') THEN
        ALTER TABLE public.expenses RENAME COLUMN data TO date;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'expenses' AND column_name = 'categoria') THEN
        ALTER TABLE public.expenses RENAME COLUMN categoria TO category;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'expenses' AND column_name = 'tipo') THEN
        ALTER TABLE public.expenses RENAME COLUMN tipo TO type;
    END IF;
END $$;

-- Índices para expenses
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- RLS para expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own expenses" ON public.expenses;
CREATE POLICY "Users can view own expenses" ON public.expenses
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
CREATE POLICY "Users can insert own expenses" ON public.expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own expenses" ON public.expenses;
CREATE POLICY "Users can update own expenses" ON public.expenses
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;
CREATE POLICY "Users can delete own expenses" ON public.expenses
    FOR DELETE USING (auth.uid() = user_id);

-- 4. TABELA DE BANCOS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para bank_accounts
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);

-- RLS para bank_accounts
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bank accounts" ON public.bank_accounts;
CREATE POLICY "Users can delete own bank accounts" ON public.bank_accounts
    FOR DELETE USING (auth.uid() = user_id);

-- 5. TABELA DE CARTÕES DE CRÉDITO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.credit_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bank_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    brand TEXT,
    limit_amount DECIMAL(10, 2) NOT NULL,
    closing_day INTEGER NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
    due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
    color TEXT DEFAULT '#000000',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para credit_cards
CREATE INDEX IF NOT EXISTS idx_credit_cards_user_id ON public.credit_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_cards_bank_id ON public.credit_cards(bank_id);

-- RLS para credit_cards
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own credit cards" ON public.credit_cards;
CREATE POLICY "Users can view own credit cards" ON public.credit_cards
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own credit cards" ON public.credit_cards;
CREATE POLICY "Users can insert own credit cards" ON public.credit_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own credit cards" ON public.credit_cards;
CREATE POLICY "Users can update own credit cards" ON public.credit_cards
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own credit cards" ON public.credit_cards;
CREATE POLICY "Users can delete own credit cards" ON public.credit_cards
    FOR DELETE USING (auth.uid() = user_id);

-- 6. TABELA DE DESPESAS DE CARTÃO
-- =====================================================
CREATE TABLE IF NOT EXISTS public.credit_card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id UUID NOT NULL REFERENCES public.credit_cards(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    category TEXT NOT NULL,
    installments INTEGER DEFAULT 1,
    installment_current INTEGER DEFAULT 1,
    original_amount DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para credit_card_transactions
CREATE INDEX IF NOT EXISTS idx_cc_transactions_user_id ON public.credit_card_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_transactions_card_id ON public.credit_card_transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_cc_transactions_date ON public.credit_card_transactions(date);

-- RLS para credit_card_transactions
ALTER TABLE public.credit_card_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cc transactions" ON public.credit_card_transactions;
CREATE POLICY "Users can view own cc transactions" ON public.credit_card_transactions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cc transactions" ON public.credit_card_transactions;
CREATE POLICY "Users can insert own cc transactions" ON public.credit_card_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cc transactions" ON public.credit_card_transactions;
CREATE POLICY "Users can update own cc transactions" ON public.credit_card_transactions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cc transactions" ON public.credit_card_transactions;
CREATE POLICY "Users can delete own cc transactions" ON public.credit_card_transactions
    FOR DELETE USING (auth.uid() = user_id);

-- 7. CONFIGURAÇÃO DE STORAGE (AVATARS)
-- =====================================================
-- Criar bucket para avatars (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- RLS para storage.objects (avatars)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =====================================================
-- ALIASES PARA COMPATIBILIDADE
-- =====================================================
-- Criar views para compatibilidade com código antigo

-- View para 'cards' (aponta para credit_cards)
CREATE OR REPLACE VIEW public.cards AS
SELECT * FROM public.credit_cards;

-- View para 'card_expenses' (aponta para credit_card_transactions)
CREATE OR REPLACE VIEW public.card_expenses AS
SELECT * FROM public.credit_card_transactions;

-- =====================================================
-- TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para todas as tabelas
DROP TRIGGER IF EXISTS update_app_users_updated_at ON public.app_users;
CREATE TRIGGER update_app_users_updated_at
    BEFORE UPDATE ON public.app_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_receitas_updated_at ON public.receitas;
CREATE TRIGGER update_receitas_updated_at
    BEFORE UPDATE ON public.receitas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER update_bank_accounts_updated_at
    BEFORE UPDATE ON public.bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_credit_cards_updated_at ON public.credit_cards;
CREATE TRIGGER update_credit_cards_updated_at
    BEFORE UPDATE ON public.credit_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cc_transactions_updated_at ON public.credit_card_transactions;
CREATE TRIGGER update_cc_transactions_updated_at
    BEFORE UPDATE ON public.credit_card_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SETUP COMPLETO!
-- =====================================================
-- Próximos passos:
-- 1. Configure as variáveis de ambiente no .env.test
-- 2. Execute o script de seed: node scripts/seed.js
-- =====================================================
