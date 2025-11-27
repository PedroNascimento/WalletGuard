# Módulo de Cartões Implementado

O módulo de Cartões de Crédito foi implementado com sucesso.

## Funcionalidades
- **CRUD de Cartões**: Criar, editar, excluir e listar cartões.
- **Gestão de Limites e Datas**: Definição de limite, dia de fechamento e vencimento.
- **Gastos Parcelados**: Ao registrar uma despesa com parcelas > 1, o sistema gera automaticamente os lançamentos futuros.
- **Visualização de Faturas**: Navegação entre meses para ver o que cai em cada fatura (baseado no dia de fechamento).
- **Cálculo de Totais**: Soma automática dos gastos da fatura e percentual de uso do limite.

## Arquivos Criados/Modificados
- `src/types/card.ts`: Tipos TypeScript.
- `src/services/cards.service.ts`: Lógica de negócios e interação com Supabase.
- `src/components/cartoes/CardForm.tsx`: Formulário de cartões.
- `src/components/cartoes/CardExpenseForm.tsx`: Formulário de despesas.
- `src/pages/cartoes/Cartoes.tsx`: Lista de cartões.
- `src/pages/cartoes/GastosCartao.tsx`: Detalhes da fatura.
- `src/App.tsx`: Novas rotas.
- `SETUP_CARDS.md`: Script SQL para criar tabelas.

## Próximos Passos para o Usuário
1. Execute o script SQL contido em `SETUP_CARDS.md` no Supabase.
2. Acesse `/cartoes` na aplicação.
3. Cadastre um cartão.
4. Adicione despesas (teste parcelamento).
