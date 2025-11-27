# 🧪 Guia do Ambiente de Testes - WalletGuard

Este documento descreve como usar o ambiente de testes configurado para o WalletGuard.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Usuários de Teste](#usuários-de-teste)
4. [Executando Testes](#executando-testes)
5. [Scripts Disponíveis](#scripts-disponíveis)
6. [Estrutura de Dados](#estrutura-de-dados)
7. [Boas Práticas](#boas-práticas)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O ambiente de testes do WalletGuard é uma instância separada do Supabase configurada especificamente para:

- ✅ Testes automatizados
- ✅ Desenvolvimento de novas features
- ✅ QA manual
- ✅ Demonstrações
- ✅ Treinamento de usuários

**⚠️ IMPORTANTE:** Este ambiente é isolado da produção e pode ser resetado a qualquer momento.

---

## ⚙️ Configuração Inicial

### 1. Pré-requisitos

- Node.js 20.19+ ou 22.12+
- Projeto de teste criado no Supabase
- Credenciais configuradas no `.env.test`

### 2. Arquivo `.env.test`

Certifique-se de que o arquivo `.env.test` na raiz do projeto contém:

```env
# Ambiente de Testes
VITE_SUPABASE_URL=https://sua-url-de-teste.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-de-teste
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-de-teste

# URL base para testes E2E (opcional)
VITE_BASE_URL=https://walletguard-git-preview-seu-usuario.vercel.app
```

### 3. Setup do Banco de Dados

Execute o script SQL no Supabase:

```bash
# 1. Acesse o SQL Editor do seu projeto de teste no Supabase
# 2. Cole e execute o conteúdo de TEST_DATABASE_SETUP.sql
```

### 4. Popular com Dados Iniciais

```bash
node scripts/seed.js
```

---

## 👥 Usuários de Teste

### Credenciais Padrão

| Email | Senha | Descrição |
|-------|-------|-----------|
| `test1@example.com` | `password123` | Usuário principal de teste |
| `test2@example.com` | `password123` | Usuário secundário de teste |

### Dados Iniciais por Usuário

Cada usuário de teste possui:

- **1 Cartão de Crédito**
  - Nome: "Cartão Teste"
  - Bandeira: Visa
  - Limite: R$ 5.000,00
  - Fechamento: Dia 10
  - Vencimento: Dia 15

- **1 Receita**
  - Descrição: "Salário Teste"
  - Valor: R$ 3.000,00
  - Categoria: Salário
  - Tipo: Fixa

- **1 Despesa**
  - Descrição: "Aluguel Teste"
  - Valor: R$ 1.000,00
  - Categoria: Moradia
  - Tipo: Fixa

---

## 🧪 Executando Testes

### Teste Automatizado Completo

Execute o script de teste para validar todo o ambiente:

```bash
node scripts/test-environment.js
```

**O que este script testa:**

1. ✅ Autenticação (login/logout)
2. ✅ CRUD de Receitas
3. ✅ CRUD de Despesas
4. ✅ CRUD de Cartões de Crédito
5. ✅ CRUD de Bancos
6. ✅ Row Level Security (RLS)

**Saída esperada:**

```
🧪 Iniciando testes do ambiente...

📝 TESTE 1: Autenticação
───────────────────────────────────────────────────────
✅ Login com usuário de teste: User ID: xxx-xxx-xxx

📝 TESTE 2: CRUD de Receitas
───────────────────────────────────────────────────────
✅ Listar receitas: 1 receita(s) encontrada(s)
✅ Criar receita: ID: xxx-xxx-xxx
✅ Atualizar receita: Valor atualizado para R$ 600
✅ Deletar receita: Receita removida

...

📊 RESUMO DOS TESTES
═══════════════════════════════════════════════════════

✅ Testes aprovados: 15
❌ Testes falhados: 0
📝 Total de testes: 15

🎯 Taxa de sucesso: 100.0%

🎉 Todos os testes passaram! Ambiente configurado corretamente.
```

### Teste Manual

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:5173`

3. **Faça login com:** `test1@example.com` / `password123`

4. **Teste as funcionalidades:**
   - Dashboard
   - Criar/editar receitas
   - Criar/editar despesas
   - Gerenciar cartões
   - Visualizar relatórios

---

## 📜 Scripts Disponíveis

### `scripts/seed.js`

Popula o banco de dados com dados iniciais.

```bash
node scripts/seed.js
```

**Quando usar:**
- Após criar um novo projeto de teste
- Para resetar os dados de teste
- Após limpar o banco de dados

### `scripts/test-environment.js`

Executa testes automatizados completos.

```bash
node scripts/test-environment.js
```

**Quando usar:**
- Após configurar o ambiente pela primeira vez
- Antes de fazer deploy
- Após mudanças no schema do banco
- Para validar RLS e permissões

---

## 🗄️ Estrutura de Dados

### Tabelas Principais

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `app_users` | Perfis de usuários | ✅ |
| `receitas` | Receitas/Entradas | ✅ |
| `expenses` | Despesas/Saídas | ✅ |
| `bank_accounts` | Contas bancárias | ✅ |
| `credit_cards` | Cartões de crédito | ✅ |
| `credit_card_transactions` | Despesas de cartão | ✅ |

### Views de Compatibilidade

| View | Aponta para |
|------|-------------|
| `cards` | `credit_cards` |
| `card_expenses` | `credit_card_transactions` |

### Storage Buckets

| Bucket | Público | Uso |
|--------|---------|-----|
| `avatars` | ✅ | Fotos de perfil dos usuários |

---

## ✅ Boas Práticas

### 1. Isolamento de Dados

- ❌ **Nunca** use dados de produção em testes
- ✅ Sempre use o ambiente de teste separado
- ✅ Mantenha credenciais de teste no `.env.test`

### 2. Limpeza Regular

```bash
# Resetar dados de teste
# 1. Acesse o SQL Editor do Supabase
# 2. Execute:
TRUNCATE TABLE receitas, expenses, credit_card_transactions, credit_cards, bank_accounts RESTART IDENTITY CASCADE;

# 3. Re-popular
node scripts/seed.js
```

### 3. Versionamento

- ❌ **Nunca** commite `.env.test` com credenciais reais
- ✅ Use `.env.test.example` como template
- ✅ Documente mudanças no schema em `TEST_DATABASE_SETUP.sql`

### 4. Testes Automatizados

- ✅ Execute `test-environment.js` antes de cada deploy
- ✅ Adicione novos testes ao script conforme novas features
- ✅ Mantenha taxa de sucesso em 100%

---

## 🔧 Troubleshooting

### Problema: "Erro ao carregar dados"

**Causa:** RLS pode estar bloqueando acesso.

**Solução:**
```sql
-- Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'receitas';

-- Recriar políticas se necessário
-- Execute novamente TEST_DATABASE_SETUP.sql
```

### Problema: "Usuário não autenticado"

**Causa:** Credenciais incorretas no `.env.test`.

**Solução:**
1. Verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
2. Confirme que o projeto de teste está ativo no Supabase
3. Re-execute o seed: `node scripts/seed.js`

### Problema: "Tabela não existe"

**Causa:** Schema não foi criado corretamente.

**Solução:**
```bash
# 1. Execute o script SQL completo
# No SQL Editor do Supabase, cole e execute:
# TEST_DATABASE_SETUP.sql

# 2. Verifique se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Problema: "Testes falhando"

**Diagnóstico:**
```bash
# Execute com mais detalhes
node scripts/test-environment.js 2>&1 | tee reports/test-output.txt
```

**Soluções comuns:**
1. Verifique conexão com Supabase
2. Confirme que o seed foi executado
3. Valide credenciais no `.env.test`
4. Revise logs de erro no Supabase Dashboard

---

## 📊 Checklist de Validação

Antes de considerar o ambiente pronto:

- [ ] `.env.test` configurado com credenciais corretas
- [ ] Script SQL executado sem erros
- [ ] Seed executado com sucesso
- [ ] Login manual funcionando
- [ ] Teste automatizado com 100% de sucesso
- [ ] RLS validado (dados isolados por usuário)
- [ ] Storage de avatars acessível
- [ ] Todas as tabelas criadas
- [ ] Índices aplicados
- [ ] Triggers funcionando

---

## 🔗 Links Úteis

- [Supabase Dashboard](https://app.supabase.com)
- [Documentação Supabase](https://supabase.com/docs)
- [SQL Editor](https://app.supabase.com/project/_/sql)
- [Storage](https://app.supabase.com/project/_/storage)

---

## 📞 Suporte

Se encontrar problemas:

1. Revise este guia
2. Execute `node scripts/test-environment.js`
3. Verifique logs no Supabase Dashboard
4. Consulte a documentação oficial

---

**Última atualização:** 27/11/2025  
**Versão:** 1.0.0
