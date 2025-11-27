# 💰 WalletGuard

**Sistema completo de gestão financeira pessoal com controle de receitas, despesas, bancos e cartões.**

---

## � Status do Projeto

**Versão:** 1.2.0  
**Progresso:** 90% Completo  
**Última Atualização:** 26/11/2025

### ✅ Módulos Implementados

- ✅ **Autenticação** - Login, Cadastro, Recuperação de Senha
- ✅ **Dashboard** - Visão geral com estatísticas e gráficos
- ✅ **Receitas** - CRUD completo com filtros e recorrência
- ✅ **Despesas** - CRUD completo com filtros e recorrência
- ✅ **Bancos** - CRUD completo com cores e saldos
- ✅ **Cartões de Crédito** - CRUD, faturas e parcelamento
- ✅ **Relatórios** - Gráficos, previsões e exportação PDF
- ✅ **Dark Mode** - Tema escuro/claro
- ✅ **Responsivo** - Mobile, Tablet e Desktop

### 🚧 Em Desenvolvimento

- 🚧 **Configurações** - Perfil e preferências

---

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Supabase** - Backend as a Service
  - Autenticação
  - Banco de dados PostgreSQL
  - Row Level Security (RLS)
  - Realtime (futuro)

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

4. **Configure o banco de dados**

Execute os scripts SQL no Supabase (na ordem):

```bash
# 1. Schema principal
supabase/schema.sql

# 2. Tabela de receitas
CRIAR_TABELA_RECEITAS.md

# 3. Colunas da tabela expenses
SETUP_EXPENSES_COMPLETO.md

# 4. Configuração da tabela banks
SETUP_BANKS.md

# 5. Configuração da tabela cards
SETUP_CARDS.md
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

---

## � Documentação

### Guias de Setup
- 📄 [CRIAR_TABELA_RECEITAS.md](CRIAR_TABELA_RECEITAS.md) - Setup da tabela de receitas
- 📄 [SETUP_EXPENSES_COMPLETO.md](SETUP_EXPENSES_COMPLETO.md) - Setup da tabela de despesas
- 📄 [SETUP_BANKS.md](SETUP_BANKS.md) - Setup da tabela de bancos
- 📄 [SETUP_CARDS.md](SETUP_CARDS.md) - Setup da tabela de cartões

### Documentação Técnica
- 📄 [FINAL_STATUS.md](FINAL_STATUS.md) - Status detalhado do projeto
- 📄 [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) - Status de implementação
- 📄 [DESPESAS_README.md](DESPESAS_README.md) - Documentação do módulo de despesas
- 📄 [BUGFIX_RECEITAS.md](BUGFIX_RECEITAS.md) - Correções aplicadas

### Implementação
- 📄 [IMPLEMENTACAO_DESPESAS.md](IMPLEMENTACAO_DESPESAS.md) - Detalhes da implementação de despesas
- 📄 [TASK_WALLETGUARD_SCAFFOLDING.md](TASK_WALLETGUARD_SCAFFOLDING.md) - Tarefas e roadmap

---

## 🎯 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Cadastro de novos usuários
- Recuperação de senha
- Sessão persistente
- Logout seguro

### 📊 Dashboard
- Saldo total (receitas - despesas)
- Total de receitas do mês
- Total de despesas do mês
- Transações recentes
- Gráficos (em desenvolvimento)

### 💵 Receitas
- ✅ Criar, editar, visualizar e deletar receitas
- ✅ Filtros por data, categoria e busca
- ✅ Paginação (10 itens por página)
- ✅ Categorias: Salário, Freelance, Investimentos, etc.
- ✅ Recorrência (Semanal, Mensal, Anual)
- ✅ Observações opcionais
- ✅ Estatísticas em tempo real

### 💸 Despesas
- ✅ Criar, editar, visualizar e deletar despesas
- ✅ Filtros por data, categoria, tipo e busca
- ✅ Paginação (10 itens por página)
- ✅ 10 categorias predefinidas
- ✅ Tipos: Fixa ou Variável
- ✅ Recorrência (Semanal, Mensal, Anual)
- ✅ Observações opcionais
- ✅ Estatísticas em tempo real

### 🏦 Bancos
- ✅ Criar, editar, visualizar e deletar bancos
- ✅ Tipos: Conta Corrente, Poupança, Investimento
- ✅ 10 cores predefinidas para gráficos
- ✅ Saldo inicial configurável
- ✅ Filtros por nome e tipo
- ✅ Verificação de cartões associados antes de deletar
- ✅ Estatísticas de saldo total

### 💳 Cartões de Crédito
- ✅ Criar, editar, visualizar e deletar cartões
- ✅ Gestão de limites e datas (fechamento/vencimento)
- ✅ Lançamento de despesas com parcelamento automático
- ✅ Visualização de faturas por mês
- ✅ Navegação entre faturas (anteriores/futuras)
- ✅ Cálculo de uso do limite

- ✅ Cálculo de uso do limite

### 📈 Relatórios
- ✅ Dashboard com evolução de receitas x despesas
- ✅ Gráfico de distribuição por categoria
- ✅ Filtros por período e categoria
- ✅ Tabela de previsão de gastos futuros
- ✅ Exportação completa em PDF

### 🎨 Interface
- ✅ Design moderno e responsivo
- ✅ Dark mode completo
- ✅ Animações suaves
- ✅ Feedback visual
- ✅ Loading states
- ✅ Empty states

---

## �️ Estrutura do Projeto

```
WalletGuard/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── bancos/         # Componentes de bancos
│   │   ├── despesas/       # Componentes de despesas
│   │   ├── layout/         # Layout (Sidebar, Header)
│   │   ├── receitas/       # Componentes de receitas
│   │   └── ui/             # Componentes UI base
│   ├── context/            # Context API
│   │   ├── AuthContext.tsx # Contexto de autenticação
│   │   └── ThemeContext.tsx# Contexto de tema
│   ├── layouts/            # Layouts de página
│   ├── pages/              # Páginas da aplicação
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── bancos/        # Página de bancos
│   │   ├── dashboard/     # Dashboard
│   │   ├── despesas/      # Página de despesas
│   │   ├── receitas/      # Página de receitas
│   │   └── cartoes/       # Páginas de cartões
│   ├── services/           # Serviços e APIs
│   │   ├── bancos.service.ts
│   │   ├── cards.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── despesas.service.ts
│   │   ├── receitas.service.ts
│   │   └── supabase.ts    # Cliente Supabase
│   ├── types/              # Tipos TypeScript
│   │   ├── banco.ts
│   │   ├── card.ts
│   │   ├── despesa.ts
│   │   └── receita.ts
│   ├── App.tsx             # Componente principal
│   ├── index.css           # Estilos globais
│   └── main.tsx            # Entry point
├── supabase/               # Scripts SQL
│   ├── schema.sql         # Schema principal
│   ├── setup-banks.sql    # Setup de bancos
│   └── add-*.sql          # Scripts de migração
├── public/                 # Arquivos públicos
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências
├── tailwind.config.js      # Configuração Tailwind
├── tsconfig.json           # Configuração TypeScript
└── vite.config.ts          # Configuração Vite
```

---

## 🔒 Segurança

### Row Level Security (RLS)

Todas as tabelas utilizam RLS do Supabase:

- ✅ **app_users** - Usuários veem apenas seus próprios dados
- ✅ **receitas** - Isolamento por user_id
- ✅ **expenses** - Isolamento por user_id
- ✅ **banks** - Isolamento por user_id
- ✅ **cards** - Isolamento por user_id
- ✅ **card_expenses** - Isolamento por user_id

### Autenticação

- ✅ Supabase Auth com JWT
- ✅ Sessão persistente com localStorage
- ✅ Timeout de segurança em operações críticas
- ✅ Logout forçado em caso de erro

---

## 📱 Responsividade

### Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Adaptações

- ✅ Sidebar colapsável em mobile
- ✅ Grid responsivo (1, 2 ou 4 colunas)
- ✅ Tabelas com scroll horizontal
- ✅ Formulários adaptáveis
- ✅ Cards empilháveis

---

## 🎨 Design System

### Cores Principais

- **Primary:** Azul (#3B82F6)
- **Success:** Verde (#10B981)
- **Warning:** Laranja (#F59E0B)
- **Danger:** Vermelho (#EF4444)
- **Dark:** Cinza escuro (#1F2937)

### Tipografia

- **Heading:** Inter (bold)
- **Body:** Inter (regular)
- **Mono:** Fira Code

---

## �️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Verifica código com ESLint
```

---

## 🐛 Problemas Conhecidos

### Críticos
- ⚠️ Tabelas do Supabase devem ser criadas manualmente
- ⚠️ RLS deve ser configurado via SQL Editor

### Menores
- ⚠️ Node.js 22.9.0 (recomendado: 20.19+ ou 22.12+)
- ⚠️ Chunks maiores que 500KB (otimização futura)

---

## 📈 Roadmap

### Versão 1.3 (Concluída)
- [x] CRUD de Cartões de Crédito
- [x] Faturas de cartão
- [x] Parcelamento de despesas

### Versão 1.4 (Concluída)
- [x] Relatórios e gráficos avançados
- [x] Exportação de dados (PDF)
- [ ] Metas financeiras (Futuro)

### Versão 2.0
- [ ] Categorias personalizadas
- [ ] Múltiplas moedas
- [ ] Importação de extratos bancários
- [ ] App mobile (React Native)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## � Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Pedro Nascimento**

- GitHub: [@PedroNascimento](https://github.com/PedroNascimento)
- Email: pedro@example.com

---

## 🙏 Agradecimentos

- [Supabase](https://supabase.com) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Ícones
- [Vite](https://vitejs.dev) - Build tool

---

**Desenvolvido com ❤️ para gestão financeira pessoal**
