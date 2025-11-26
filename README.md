# 💰 WalletGuard

> Gerencie suas finanças com segurança e inteligência

[![Status](https://img.shields.io/badge/Status-85%25%20Completo-success)](https://github.com)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## 📋 Sobre o Projeto

**WalletGuard** é uma aplicação web moderna de gestão financeira pessoal que permite controlar receitas, despesas, cartões de crédito e muito mais, tudo em um só lugar com segurança e facilidade.

### ✨ Funcionalidades Principais

- ✅ **Autenticação Segura** - Login, cadastro e recuperação de senha
- ✅ **Gestão de Receitas** - CRUD completo com filtros e paginação
- ✅ **Dashboard Inteligente** - Visualize suas finanças em tempo real
- ✅ **Dark Mode** - Interface adaptável ao seu gosto
- ✅ **Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- ✅ **Segurança RLS** - Seus dados são protegidos por Row Level Security
- ⏳ **Gestão de Despesas** - Em desenvolvimento
- ⏳ **Cartões de Crédito** - Em desenvolvimento
- ⏳ **Relatórios Avançados** - Em desenvolvimento

---

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v4** - Estilização moderna
- **React Router** - Navegação
- **Lucide Icons** - Ícones SVG

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security
  - Real-time subscriptions

### Ferramentas
- **ESLint** - Linting
- **PostCSS** - Processamento CSS
- **Git** - Controle de versão

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20.19+ ou 22.12+
- npm ou yarn
- Conta no Supabase

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/WalletGuard.git
cd WalletGuard
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Execute o schema SQL no Supabase**

- Acesse o SQL Editor do Supabase
- Execute o script `supabase/schema.sql`
- Ou siga o guia em `CRIAR_TABELA_RECEITAS.md`

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

---

## 📖 Documentação

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Guia completo de configuração
- **[FINAL_STATUS.md](FINAL_STATUS.md)** - Status atual do projeto
- **[RECEITAS_README.md](RECEITAS_README.md)** - Documentação do CRUD de Receitas
- **[CRIAR_TABELA_RECEITAS.md](CRIAR_TABELA_RECEITAS.md)** - Como criar tabelas no Supabase
- **[TASK_WALLETGUARD_SCAFFOLDING.md](TASK_WALLETGUARD_SCAFFOLDING.md)** - Task detalhada

---

## 🎯 Roadmap

### ✅ Fase 1: Fundação (Completo)
- [x] Setup do projeto
- [x] Database schema
- [x] Autenticação
- [x] UI base
- [x] Dark mode

### ⚠️ Fase 2: Features Core (40% Completo)
- [x] CRUD de Receitas
- [x] Dashboard com dados reais
- [ ] CRUD de Despesas
- [ ] CRUD de Cartões
- [ ] CRUD de Bancos

### ⏳ Fase 3: Features Avançadas (0%)
- [ ] Relatórios com gráficos
- [ ] Exportação de dados
- [ ] Notificações
- [ ] Configurações avançadas

### ⏳ Fase 4: Polimento (0%)
- [ ] Testes automatizados
- [ ] Performance optimization
- [ ] PWA
- [ ] App mobile (React Native)

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run start        # Preview da build de produção

# Qualidade
npm run lint         # Executa ESLint
```

---

## 📁 Estrutura do Projeto

```
WalletGuard/
├── public/              # Arquivos estáticos
│   ├── logo.png
│   └── logo-dark.png
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── layout/      # Layout (Header, Sidebar)
│   │   ├── receitas/    # Componentes de receitas
│   │   └── ui/          # Componentes UI base
│   ├── context/         # Contexts (Auth, Theme)
│   ├── layouts/         # Layouts (App, Auth)
│   ├── pages/           # Páginas da aplicação
│   │   ├── auth/        # Login, Signup, etc
│   │   ├── dashboard/   # Dashboard
│   │   └── receitas/    # Gestão de receitas
│   ├── services/        # Services de API
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilitários
│   ├── App.tsx          # Componente principal
│   ├── index.css        # Estilos globais
│   └── main.tsx         # Entry point
├── supabase/            # Scripts SQL
│   ├── schema.sql       # Schema completo
│   └── add-receitas-table.sql
├── .env                 # Variáveis de ambiente
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Features Implementadas

### Autenticação
- Login com email/senha
- Cadastro de novos usuários
- Recuperação de senha
- Logout seguro
- Proteção de rotas
- Sincronização automática de usuários

### Receitas
- Criar, editar e deletar receitas
- Filtros por período e categoria
- Paginação (10 itens/página)
- Suporte a recorrência (semanal/mensal/anual)
- Estatísticas agregadas
- Categorias: Salário, Freelance, Investimentos, Aluguel, Vendas, Bonificação, Outros

### Dashboard
- Saldo total calculado
- Receitas do mês
- Despesas do mês
- Cartões ativos
- Transações recentes
- Cards visuais com métricas

### UI/UX
- Dark mode com persistência
- Design responsivo
- Loading states
- Empty states
- Feedback visual de ações
- Validação de formulários

---

## 🔒 Segurança

- **Row Level Security (RLS)** - Cada usuário vê apenas seus próprios dados
- **Autenticação Supabase** - Sistema de autenticação robusto
- **Políticas de Segurança** - SELECT, INSERT, UPDATE, DELETE protegidos
- **Validação de Dados** - Validação no frontend e backend
- **Timeouts de Segurança** - Previne travamentos em operações críticas

---

## 🐛 Problemas Conhecidos

### Resolvidos ✅
- ✅ Logout não funcionava - Implementado timeout de segurança
- ✅ Login travava - Implementado timeout no syncUser
- ✅ Receitas não eram criadas - Injeção automática de user_id
- ✅ Script start não existia - Adicionado ao package.json

### Pendentes ⚠️
- ⚠️ Tabela `receitas` precisa ser criada manualmente no Supabase
- ⚠️ Node.js 22.9.0 gera warning (recomendado 22.12+)

---

## 📊 Status do Projeto

**Última Atualização:** 26/11/2025  
**Versão:** 1.0.0  
**Status:** 85% Completo

| Módulo | Status |
|--------|--------|
| Autenticação | ✅ 100% |
| CRUD Receitas | ✅ 100% |
| Dashboard | ✅ 85% |
| UI/UX | ✅ 100% |
| CRUD Despesas | ❌ 0% |
| CRUD Cartões | ❌ 0% |
| Relatórios | ❌ 0% |

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Seu Nome]

---

## 🙏 Agradecimentos

- [React](https://react.dev/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email: suporte@walletguard.com

---

**WalletGuard** - Suas finanças sob controle 💰
