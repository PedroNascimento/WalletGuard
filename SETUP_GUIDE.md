# 🚀 Guia de Setup Completo - WalletGuard

## Pré-requisitos

- Node.js 20.19+ ou 22.12+
- Conta no Supabase (https://supabase.com)
- Git instalado

## 1️⃣ Setup do Projeto Local

### 1.1 Clone e Instale Dependências

```bash
cd c:\Users\Pedro\Desktop\micro-saas\WalletGuard
npm install
```

### 1.2 Configure Variáveis de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**Como obter as credenciais:**
1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** → `VITE_SUPABASE_ANON_KEY`

---

## 2️⃣ Setup do Banco de Dados no Supabase

### 2.1 Executar Schema Principal

1. Acesse o **SQL Editor** no Supabase
2. Abra o arquivo `supabase/schema.sql`
3. Copie todo o conteúdo
4. Cole no SQL Editor
5. Clique em **Run** ou pressione `Ctrl+Enter`

**O que será criado:**
- ✅ Tabela `app_users` (metadados de usuários)
- ✅ Tabela `banks` (bancos)
- ✅ Tabela `cards` (cartões)
- ✅ Tabela `incomes` (receitas antigas)
- ✅ Tabela `receitas` (receitas novas - CRUD implementado)
- ✅ Tabela `expenses` (despesas)
- ✅ Tabela `card_expenses` (despesas de cartão)
- ✅ Tabela `categories` (categorias)
- ✅ View `vw_monthly_summary` (resumo mensal)
- ✅ RLS habilitado em todas as tabelas
- ✅ Políticas de segurança configuradas

### 2.2 Verificar Tabelas Criadas

No Supabase, vá em **Table Editor** e verifique se todas as tabelas foram criadas:
- app_users
- banks
- cards
- incomes
- **receitas** ← Importante!
- expenses
- card_expenses
- categories

---

## 3️⃣ Testar Autenticação

### 3.1 Criar Primeiro Usuário

1. Execute o projeto:
```bash
npm run dev
```

2. Acesse http://localhost:5173

3. Clique em **"Criar conta gratuita"**

4. Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
   - Senha: mínimo 6 caracteres

5. Após criar, faça login

### 3.2 Verificar Usuário no Supabase

1. Vá em **Authentication** > **Users**
2. Você deve ver seu usuário criado
3. Vá em **Table Editor** > **app_users**
4. Você deve ver um registro com seu email

---

## 4️⃣ Testar CRUD de Receitas

### 4.1 Acessar Página de Receitas

1. Com o projeto rodando, faça login
2. Clique em **"Receitas"** no menu lateral
3. Clique em **"Nova Receita"**

### 4.2 Criar Receita de Teste

Preencha o formulário:
- **Descrição**: Salário Novembro
- **Valor**: 5000
- **Data**: Data atual
- **Categoria**: Salário
- **Recorrente**: ✓ (marcado)
- **Frequência**: Mensal
- **Observações**: Pagamento mensal

Clique em **"Criar Receita"**

### 4.3 Verificar no Banco

1. Vá no Supabase > **Table Editor** > **receitas**
2. Você deve ver sua receita criada
3. Verifique que o `user_id` corresponde ao seu ID de usuário

### 4.4 Testar RLS (Row Level Security)

**Teste 1: Criar outro usuário**
1. Faça logout
2. Crie uma nova conta com outro email
3. Faça login com a nova conta
4. Vá em Receitas
5. ✅ A lista deve estar vazia (não vê receitas do primeiro usuário)

**Teste 2: Tentar acessar receita de outro usuário**
1. No Supabase, copie o ID de uma receita do primeiro usuário
2. Logado como segundo usuário, tente buscar via API:
```javascript
// No console do navegador
const { data, error } = await supabase
  .from('receitas')
  .select('*')
  .eq('id', 'id-da-receita-do-outro-usuario')
  .single();

console.log(data); // Deve ser null
console.log(error); // Deve retornar erro ou "Row not found"
```

---

## 5️⃣ Testar Dashboard

### 5.1 Acessar Dashboard

1. Faça login
2. Clique em **"Dashboard"** no menu
3. Você deve ver:
   - ✅ Saldo Total (calculado)
   - ✅ Receitas do Mês
   - ✅ Despesas do Mês
   - ✅ Cartões Ativos
   - ✅ Transações Recentes

### 5.2 Verificar Dados Reais

- Se você criou receitas, elas devem aparecer no card "Receitas do Mês"
- O saldo deve ser calculado automaticamente
- As transações recentes devem listar suas últimas movimentações

---

## 6️⃣ Estrutura de Pastas

```
WalletGuard/
├── public/
│   ├── logo.png
│   └── logo-dark.png
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── RequireAuth.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── receitas/
│   │   │   ├── ReceitaForm.tsx
│   │   │   └── ReceitaFilters.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── layouts/
│   │   ├── AppLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   └── receitas/
│   │       └── Receitas.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   ├── dashboard.service.ts
│   │   └── receitas.service.ts
│   ├── types/
│   │   └── receita.ts
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── schema.sql (schema completo)
│   └── add-receitas-table.sql (apenas tabela receitas)
├── .env
├── package.json
└── README.md
```

---

## 7️⃣ Comandos Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Compila para produção
npm run preview      # Preview da build de produção
```

### Verificar Erros
```bash
npm run build        # Verifica erros de TypeScript
```

---

## 8️⃣ Features Implementadas

### ✅ Autenticação Completa
- Login com email/senha
- Cadastro de novos usuários
- Recuperação de senha
- Sincronização automática com `app_users`
- Proteção de rotas
- Logout

### ✅ CRUD de Receitas
- Listar com paginação (10 itens/página)
- Filtros (busca, período, categoria)
- Criar receita
- Editar receita
- Deletar receita
- Suporte a recorrência (semanal/mensal/anual)
- Validação de formulários
- Estatísticas agregadas

### ✅ Dashboard com Dados Reais
- Saldo total calculado
- Receitas do mês
- Despesas do mês
- Cartões ativos
- Transações recentes
- Loading states

### ✅ Dark Mode
- Toggle no header
- Persistência em localStorage
- Todos os componentes adaptados

### ✅ RLS (Row Level Security)
- Políticas configuradas em todas as tabelas
- Usuários veem apenas seus próprios dados
- Proteção contra acesso não autorizado

---

## 9️⃣ Próximos Passos

### Features a Implementar
1. **CRUD de Despesas** (seguir padrão de Receitas)
2. **CRUD de Cartões**
3. **CRUD de Bancos**
4. **Página de Relatórios** com gráficos
5. **Configurações de usuário**
6. **Exportação de dados** (CSV/PDF)

### Melhorias Sugeridas
- Adicionar gráficos no Dashboard (Chart.js ou Recharts)
- Implementar busca avançada
- Adicionar anexos/comprovantes
- Notificações de vencimentos
- App mobile (React Native)

---

## 🆘 Troubleshooting

### Erro: "Missing Supabase environment variables"
**Solução:** Verifique se o arquivo `.env` existe e contém as variáveis corretas.

### Erro: "relation 'receitas' does not exist"
**Solução:** Execute o script `supabase/add-receitas-table.sql` no SQL Editor do Supabase.

### Erro: "new row violates row-level security policy"
**Solução:** Verifique se o `user_id` está sendo passado corretamente nas requisições.

### Dashboard mostra valores zerados
**Solução:** Crie algumas receitas e despesas de teste para popular os dados.

### Build falha com erros de TypeScript
**Solução:** Execute `npm run build` e corrija os erros apontados.

---

## 📚 Documentação Adicional

- **RECEITAS_README.md** - Documentação detalhada do CRUD de Receitas
- **IMPLEMENTATION_STATUS.md** - Status de implementação do projeto
- **Supabase Docs** - https://supabase.com/docs

---

## ✅ Checklist de Setup

- [ ] Node.js instalado (versão correta)
- [ ] Projeto clonado
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Schema SQL executado no Supabase
- [ ] Tabela `receitas` criada
- [ ] Primeiro usuário criado
- [ ] Login funcionando
- [ ] CRUD de Receitas testado
- [ ] RLS testado (dois usuários)
- [ ] Dashboard exibindo dados reais
- [ ] Dark mode funcionando

---

**Projeto pronto para uso! 🎉**

Para suporte ou dúvidas, consulte a documentação ou abra uma issue no repositório.
