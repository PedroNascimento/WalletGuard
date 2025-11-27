# Guia de Deploy - WalletGuard

Este guia descreve o processo de deploy da aplicação WalletGuard utilizando **Supabase** (Backend/Database) e **Vercel** (Frontend).

## 1. Configuração do Supabase

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto.
2. Anote a `Project URL` e a `anon public key` nas configurações de API.

### 1.2 Configurar Banco de Dados
Vá até o **SQL Editor** no dashboard do Supabase e execute os scripts de criação de tabelas.
Você pode encontrar o schema completo no arquivo `FINAL_SCHEMA.sql` (que será gerado na raiz do projeto).

O schema inclui:
- Tabela `app_users` (perfil público)
- Tabela `receitas`
- Tabela `expenses` (despesas)
- Tabela `credit_cards`
- Tabela `credit_card_transactions`
- Tabela `bank_accounts`
- Policies RLS (Row Level Security) para segurança.

### 1.3 Configurar Storage (Avatars)
1. Vá para a seção **Storage**.
2. Crie um bucket público chamado `avatars`.
3. Adicione as policies de acesso (ver `SETUP_STORAGE.md`).

### 1.4 Configurar Auth
1. Vá para **Authentication** -> **Providers**.
2. Habilite **Email/Password**.
3. Desabilite "Confirm email" se quiser login imediato para testes (não recomendado para produção).

## 2. Configuração do Frontend (Vercel)

### 2.1 Importar Projeto
1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em "Add New..." -> "Project".
3. Importe o repositório do GitHub onde o código está hospedado.

### 2.2 Configurar Build
O Vercel deve detectar automaticamente que é um projeto Vite.
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2.3 Variáveis de Ambiente
Na tela de configuração do projeto no Vercel, adicione as seguintes variáveis:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | Sua Project URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sua Anon Public Key do Supabase |

### 2.4 Deploy
Clique em **Deploy**. O Vercel irá construir o projeto e fornecer uma URL pública.

## 3. Pós-Deploy

### 3.1 URL de Redirecionamento (Auth)
1. Copie a URL do seu site no Vercel (ex: `https://walletguard.vercel.app`).
2. Volte ao Supabase -> **Authentication** -> **URL Configuration**.
3. Adicione sua URL do Vercel em **Site URL** e **Redirect URLs**.

### 3.2 Teste Final
Acesse a aplicação, crie uma conta e verifique se consegue logar e salvar dados.

---

## Solução de Problemas Comuns

- **Erro 404 ao recarregar página:**
  Certifique-se de adicionar um arquivo `vercel.json` na raiz com a configuração de rewrite para SPA:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```

- **Erro de CORS:**
  Verifique se a URL do Vercel está permitida nas configurações de API do Supabase (embora geralmente não seja necessário para o client-side padrão).
