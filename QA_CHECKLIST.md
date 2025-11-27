# Checklist de QA (Quality Assurance) - WalletGuard

Use esta lista para validar a aplicação antes de cada release.

## 1. Autenticação
- [ ] **Cadastro (Sign Up):** Criar nova conta com email/senha válidos.
- [ ] **Login:** Acessar com credenciais corretas.
- [ ] **Login Inválido:** Tentar acessar com senha errada (deve mostrar erro).
- [ ] **Logout:** Sair da aplicação e ser redirecionado para login.
- [ ] **Recuperação de Senha:** Fluxo de "Esqueci minha senha" (envio de email).
- [ ] **Persistência:** Recarregar a página mantém o usuário logado.

## 2. Dashboard
- [ ] **Carregamento:** Cards de resumo carregam corretamente.
- [ ] **Gráficos:** Gráfico de Receitas vs Despesas renderiza.
- [ ] **Transações Recentes:** Lista mostra os últimos itens.
- [ ] **Filtros:** Alterar mês/ano atualiza os dados.

## 3. Receitas
- [ ] **Listagem:** Mostra receitas do mês selecionado.
- [ ] **Criação:** Adicionar nova receita (com e sem recorrência).
- [ ] **Edição:** Alterar valor e descrição de uma receita existente.
- [ ] **Exclusão:** Remover uma receita e verificar atualização do saldo.
- [ ] **Filtros:** Filtrar por categoria ou busca textual.

## 4. Despesas
- [ ] **Listagem:** Mostra despesas do mês selecionado.
- [ ] **Criação:** Adicionar nova despesa (fixa e variável).
- [ ] **Edição:** Alterar dados da despesa.
- [ ] **Exclusão:** Remover despesa.
- [ ] **Cartão de Crédito:** Criar despesa vinculada a um cartão (se aplicável).

## 5. Cartões de Crédito
- [ ] **Listagem:** Mostra cartões cadastrados.
- [ ] **Criação:** Adicionar novo cartão (limite, dia fechamento, vencimento).
- [ ] **Fatura:** Visualizar gastos de uma fatura específica.
- [ ] **Barra de Progresso:** Verifica se o uso do limite está visualmente correto.

## 6. Configurações
- [ ] **Perfil:** Alterar nome e foto de perfil (Avatar).
- [ ] **Tema:** Alternar entre Dark Mode e Light Mode.
- [ ] **Senha:** Alterar senha atual.
- [ ] **Exportação:** Baixar backup dos dados (JSON).

## 7. Responsividade e UX
- [ ] **Mobile:** Menu de navegação funciona em telas pequenas.
- [ ] **Tabelas:** Rolagem horizontal em tabelas largas no mobile.
- [ ] **Toasts:** Notificações de sucesso/erro aparecem e somem.
- [ ] **Loading States:** Spinners aparecem durante requisições.

## 8. Segurança (RLS)
- [ ] **Isolamento:** Usuário A não vê dados do Usuário B (testar com duas contas).
