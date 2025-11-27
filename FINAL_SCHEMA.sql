-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Tabela de Usuários (Perfil Público)
create table if not exists app_users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS app_users
alter table app_users enable row level security;
create policy "Users can view their own profile" on app_users for select using (auth.uid() = id);
create policy "Users can update their own profile" on app_users for update using (auth.uid() = id);
create policy "Users can insert their own profile" on app_users for insert with check (auth.uid() = id);

-- Tabela Receitas
create table if not exists receitas (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  descricao text not null,
  valor numeric not null,
  data date not null,
  categoria text,
  recorrente boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Receitas
alter table receitas enable row level security;
create policy "Users can view own receitas" on receitas for select using (auth.uid() = user_id);
create policy "Users can insert own receitas" on receitas for insert with check (auth.uid() = user_id);
create policy "Users can update own receitas" on receitas for update using (auth.uid() = user_id);
create policy "Users can delete own receitas" on receitas for delete using (auth.uid() = user_id);

-- Tabela Despesas (Expenses)
create table if not exists expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  description text not null,
  value numeric not null,
  date date not null,
  category text,
  type text check (type in ('fixa', 'variavel')),
  recurring boolean default false,
  recurring_frequency text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Expenses
alter table expenses enable row level security;
create policy "Users can view own expenses" on expenses for select using (auth.uid() = user_id);
create policy "Users can insert own expenses" on expenses for insert with check (auth.uid() = user_id);
create policy "Users can update own expenses" on expenses for update using (auth.uid() = user_id);
create policy "Users can delete own expenses" on expenses for delete using (auth.uid() = user_id);

-- Tabela Cartões de Crédito
create table if not exists credit_cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  last_digits text,
  color text,
  limit_amount numeric not null,
  closing_day integer not null,
  due_day integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Credit Cards
alter table credit_cards enable row level security;
create policy "Users can view own cards" on credit_cards for select using (auth.uid() = user_id);
create policy "Users can insert own cards" on credit_cards for insert with check (auth.uid() = user_id);
create policy "Users can update own cards" on credit_cards for update using (auth.uid() = user_id);
create policy "Users can delete own cards" on credit_cards for delete using (auth.uid() = user_id);

-- Tabela Transações de Cartão
create table if not exists credit_card_transactions (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references credit_cards on delete cascade not null,
  user_id uuid references auth.users not null,
  description text not null,
  amount numeric not null,
  date date not null,
  category text,
  installments integer default 1,
  installment_number integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Credit Card Transactions
alter table credit_card_transactions enable row level security;
create policy "Users can view own card transactions" on credit_card_transactions for select using (auth.uid() = user_id);
create policy "Users can insert own card transactions" on credit_card_transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own card transactions" on credit_card_transactions for update using (auth.uid() = user_id);
create policy "Users can delete own card transactions" on credit_card_transactions for delete using (auth.uid() = user_id);

-- Tabela Contas Bancárias
create table if not exists bank_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  balance numeric default 0,
  type text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Bank Accounts
alter table bank_accounts enable row level security;
create policy "Users can view own bank accounts" on bank_accounts for select using (auth.uid() = user_id);
create policy "Users can insert own bank accounts" on bank_accounts for insert with check (auth.uid() = user_id);
create policy "Users can update own bank accounts" on bank_accounts for update using (auth.uid() = user_id);
create policy "Users can delete own bank accounts" on bank_accounts for delete using (auth.uid() = user_id);

-- Storage (Avatars)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
create policy "Avatar images are publicly accessible." on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload an avatar." on storage.objects for insert with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );
create policy "Users can update their own avatar." on storage.objects for update using ( bucket_id = 'avatars' AND auth.uid() = owner );
