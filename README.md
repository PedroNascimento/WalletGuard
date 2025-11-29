# 💰 WalletGuard

> **Sistema Completo de Gestão Financeira Pessoal**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/PedroNascimento/WalletGuard)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/PedroNascimento/WalletGuard)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🎯 Sobre o Projeto

**WalletGuard** é uma aplicação web moderna e completa para gestão financeira pessoal, desenvolvida como um Progressive Web App (PWA). O sistema oferece controle total sobre suas finanças, permitindo o gerenciamento de receitas, despesas, contas bancárias, cartões de crédito, metas e orçamentos em uma interface intuitiva e responsiva.

### 🌟 Objetivo

Fornecer uma ferramenta **gratuita, segura e completa** para que qualquer pessoa possa:
- 📊 Visualizar sua situação financeira em tempo real
- 💰 Controlar receitas e despesas com categorização inteligente
- 🏦 Gerenciar múltiplas contas bancárias e investimentos
- 💳 Acompanhar faturas e limites de cartões de crédito
- 🎯 Definir e alcançar metas financeiras
- 🧮 Planejar orçamentos mensais e evitar gastos excessivos
- 📈 Gerar relatórios detalhados e exportar dados

---

## 📊 Status do Projeto

**Versão Atual:** `2.0.0`  
**Status:** ✅ **Produção** (Build Estável)  
**Última Atualização:** 28/11/2025  
**Nome do Pacote:** `wallet-guard`

> 📄 **Relatório Detalhado:** Consulte [PROJECT_STATUS_MASTER.md](reports/PROJECT_STATUS_MASTER.md) para análise técnica completa.

### ✅ Módulos Implementados

- ✅ **Autenticação** - Login, Cadastro, Recuperação de Senha
- ✅ **Dashboard** - Visão geral com estatísticas e gráficos
- ✅ **Receitas** - CRUD completo com filtros e recorrência
- ✅ **Despesas** - CRUD completo com filtros e recorrência
- ✅ **Metas Financeiras** - Definição de objetivos e acompanhamento de progresso
- ✅ **Orçamentos** - Planejamento mensal por categoria com alertas
- ✅ **Bancos** - CRUD completo com cores e saldos
- ✅ **Cartões de Crédito** - CRUD, faturas e parcelamento
- ✅ **Relatórios** - Gráficos, previsões e exportação PDF
- ✅ **Configurações** - Perfil (com foto), segurança e backup
- ✅ **Dark Mode** - Tema escuro/claro
- ✅ **Responsivo** - Mobile, Tablet e Desktop

### 🚀 Próximos Passos (v2.1)

- 🚧 **Testes Unitários** (Recriação após atualização)
- 🚧 **Otimização de Performance** (Code splitting avançado)
- 🚧 **Importação de Extratos** (OFX/CSV)

---

## 🚀 Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript 5.9** - Tipagem estática
- **Vite 7.2** - Build tool
- **Tailwind CSS 4.1** - Estilização
- **React Router DOM 7.9** - Roteamento
- **Lucide React** - Ícones

### Backend
- **Supabase** - Backend as a Service
  - Autenticação JWT
  - Banco de dados PostgreSQL
  - Row Level Security (RLS)
  - Storage (Avatares)
  - Realtime (futuro)

### Bibliotecas Adicionais
- **Recharts** - Gráficos e visualizações
- **jsPDF** - Exportação de relatórios em PDF
- **date-fns** - Manipulação de datas
- **file-saver** - Download de arquivos

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

# 2. Tabelas adicionais (Receitas, Despesas, Bancos, Cartões)
# Consulte os arquivos em supabase/ ou reports/

# 3. Metas e Orçamentos (v2.0.0)
supabase/setup-metas.sql
supabase/setup-orcamentos.sql
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

## 📚 Documentação

### Guias de Implementação v2.0.0
- 📄 [V2_IMPLEMENTATION_GUIDE.md](reports/V2_IMPLEMENTATION_GUIDE.md) - Guia Técnico de Implementação
- 📄 [V2_FRONTEND_IMPLEMENTATION.md](reports/V2_FRONTEND_IMPLEMENTATION.md) - Detalhes do Frontend

### Guias de Setup
- 📄 [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Guia completo de Deploy (Supabase + Vercel)
- 📄 [PWA_GUIDE.md](PWA_GUIDE.md) - Guia de Instalação Mobile (PWA)
- 📄 [QA_CHECKLIST.md](QA_CHECKLIST.md) - Checklist de Qualidade antes do deploy

### Documentação Técnica
- 📄 [PROJECT_STATUS_MASTER.md](reports/PROJECT_STATUS_MASTER.md) - **Relatório Mestre do Projeto**
- 📄 [FINAL_SCHEMA.sql](FINAL_SCHEMA.sql) - Schema SQL completo do banco de dados

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
- Número de cartões ativos
- Transações recentes
- Resumo por categoria

### 🎯 Metas Financeiras (Novo v2.0)
- ✅ Criar metas com valor alvo e prazo
- ✅ Acompanhar progresso visualmente
- ✅ Adicionar contribuições avulsas
- ✅ Status automático (Em andamento, Concluída, Atrasada)
- ✅ Categorização (Viagem, Emergência, Investimento, etc.)

### 🧮 Orçamentos (Novo v2.0)
- ✅ Criar orçamentos mensais
- ✅ Definir limites por categoria
- ✅ Sincronização automática com despesas lançadas
- ✅ Alertas visuais de gastos excedidos
- ✅ Comparativo Planejado vs Realizado

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
- ✅ Associação com bancos

### 📈 Relatórios
- ✅ Dashboard com evolução de receitas x despesas
- ✅ Gráfico de distribuição por categoria
- ✅ Filtros por período e categoria
- ✅ Tabela de previsão de gastos futuros
- ✅ Exportação completa em PDF

### ⚙️ Configurações
- ✅ Edição de perfil (nome e foto)
- ✅ Upload de avatar (Supabase Storage)
- ✅ Alteração de senha
- ✅ Controle de tema (Dark/Light)
- ✅ Exportação de dados (Backup JSON)

### 🎨 Interface
- ✅ Design moderno e responsivo
- ✅ Dark mode completo
- ✅ Animações suaves
- ✅ Feedback visual (toasts)
- ✅ Loading states
- ✅ Empty states
- ✅ Sidebar colapsável

---

## 🗂️ Estrutura do Projeto

```
WalletGuard/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── auth/           # Componentes de autenticação
│   │   ├── bancos/         # Componentes de bancos
│   │   ├── cartoes/        # Componentes de cartões
│   │   ├── despesas/       # Componentes de despesas
│   │   ├── layout/         # Layout (Sidebar, Header)
│   │   ├── metas/          # Componentes de metas (v2.0)
│   │   ├── orcamentos/     # Componentes de orçamentos (v2.0)
│   │   ├── receitas/       # Componentes de receitas
│   │   ├── relatorios/     # Componentes de relatórios
│   │   └── ui/             # Componentes UI base
│   ├── context/            # Context API
│   ├── layouts/            # Layouts de página
│   ├── pages/              # Páginas da aplicação
│   │   ├── metas/          # Página de metas (v2.0)
│   │   ├── orcamentos/     # Página de orçamentos (v2.0)
│   │   └── ...             # Outras páginas
│   ├── services/           # Serviços e APIs
│   │   ├── metas.service.ts
│   │   ├── orcamentos.service.ts
│   │   └── ...
│   ├── types/              # Tipos TypeScript
│   │   ├── meta.ts
│   │   ├── orcamento.ts
│   │   └── ...
│   ├── utils/              # Utilitários
│   ├── App.tsx             # Componente principal
│   ├── index.css           # Estilos globais
│   └── main.tsx            # Entry point
├── public/                 # Arquivos públicos
├── reports/                # Relatórios e documentação
├── supabase/               # Scripts SQL
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
- ✅ **metas** - Isolamento por user_id (v2.0)
- ✅ **orcamentos** - Isolamento por user_id (v2.0)

### Autenticação

- ✅ Supabase Auth com JWT
- ✅ Sessão persistente com localStorage
- ✅ Timeout de segurança em operações críticas
- ✅ Logout forçado em caso de erro
- ✅ Proteção de rotas com RequireAuth

### Auditoria

- ✅ 0 vulnerabilidades (npm audit)
- ✅ Dependências atualizadas
- ✅ TypeScript strict mode

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
- ✅ Menu hambúrguer em mobile

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

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview do build de produção

# Linting
npm run lint         # Verifica código com ESLint

# Testes
npm test             # Executa testes unitários
npm run test:watch   # Executa testes em modo watch
npm run test:ui      # Interface gráfica dos testes
npm run test:coverage # Relatório de cobertura
```

---

## 🐛 Problemas Conhecidos

### Críticos
- ⚠️ Tabelas do Supabase devem ser criadas manualmente
- ⚠️ RLS deve ser configurado via SQL Editor

### Menores
- ⚠️ Node.js 22.9.0 (recomendado: 20.19+ ou 22.12+)
- ⚠️ Chunks maiores que 500KB (otimização futura)

### Dívida Técnica
- ⚠️ Testes unitários precisam ser recriados para as novas funcionalidades

---

## 📈 Roadmap

### Versão 2.0.0 (Atual)
- [x] Metas financeiras
- [x] Orçamentos mensais
- [x] Ícones PWA
- [x] Build estável

### Versão 2.1.0 (Próxima)
- [ ] Recriar testes unitários
- [ ] Otimização de chunks
- [ ] Importação de extratos

### Versão 3.0.0
- [ ] Múltiplas moedas
- [ ] App mobile nativo (React Native)
- [ ] Compartilhamento de contas (Família)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

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
- [Recharts](https://recharts.org) - Biblioteca de gráficos

---

**Desenvolvido com ❤️ para gestão financeira pessoal**
