# WalletGuard

Aplicação de gestão financeira pessoal.

## Comandos de Desenvolvimento

- `npm install`: Instalar dependências
- `npm run dev`: Iniciar servidor de desenvolvimento
- `npm run build`: Gerar build de produção
- `npm run lint`: Verificar código com ESLint

## Configuração
 
 1. Crie um arquivo `.env` na raiz do projeto com as credenciais do Supabase:
 ```env
 VITE_SUPABASE_URL=sua_url_supabase
 VITE_SUPABASE_ANON_KEY=sua_chave_anonima
 ```
 
 2. Execute o script de banco de dados (já incluído em `supabase/schema.sql`) no painel do Supabase ou via script utilitário.
 
 ## Funcionalidades
 
 - **Autenticação**: Login, Cadastro, Recuperação de Senha (Supabase Auth)
 - **Dashboard**: Visão geral (Placeholder)
 - **Gestão**: Receitas, Despesas, Cartões, Bancos

## Estrutura do Projeto

- `/src/components`: Componentes reutilizáveis (UI e Layout)
- `/src/pages`: Páginas da aplicação
- `/src/layouts`: Layouts principais (Auth e App)
- `/src/hooks`: Custom hooks
- `/src/services`: Integração com APIs (Supabase)
- `/src/utils`: Funções utilitárias
