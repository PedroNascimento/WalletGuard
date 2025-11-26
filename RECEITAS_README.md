# CRUD de Receitas - Documentação

## Funcionalidades Implementadas

### ✅ Lista Paginada
- Exibição de receitas em tabela responsiva
- Paginação com 10 itens por página
- Navegação entre páginas (Anterior/Próxima)
- Contador de registros exibidos

### ✅ Filtros
- **Busca por descrição**: Pesquisa parcial (case-insensitive)
- **Período**: Filtro por data início e data fim
- **Categoria**: Filtro por categoria específica
- **Limpar filtros**: Botão para resetar todos os filtros

### ✅ Formulário de Criação/Edição
- Validação de campos obrigatórios
- Campos:
  - Descrição (obrigatório)
  - Valor (obrigatório, numérico)
  - Data (obrigatório)
  - Categoria (select com opções predefinidas)
  - Recorrente (checkbox)
  - Frequência de recorrência (condicional, aparece se recorrente = true)
  - Observações (opcional, textarea)
- Feedback visual de erros
- Modal responsivo com dark mode

### ✅ Suporte a Recorrência
- Checkbox para marcar receita como recorrente
- Seleção de frequência: Semanal, Mensal ou Anual
- Validação: frequência obrigatória se recorrente = true

### ✅ Estatísticas
- Total de receitas (soma dos valores)
- Quantidade de receitas recorrentes
- Quantidade total de registros
- Cards visuais com ícones

### ✅ Operações CRUD
- **Create**: Adicionar nova receita
- **Read**: Listar e visualizar receitas
- **Update**: Editar receita existente
- **Delete**: Excluir receita com confirmação

### ✅ Atualização da View
- Após criar, atualizar ou deletar, a função `refreshMonthlySummary()` é chamada
- Preparado para refresh de materialized views se necessário

## Estrutura de Arquivos

```
src/
├── types/
│   └── receita.ts                    # Tipos TypeScript
├── services/
│   └── receitas.service.ts           # API Service com Supabase
├── components/
│   └── receitas/
│       ├── ReceitaForm.tsx           # Formulário modal
│       └── ReceitaFilters.tsx        # Componente de filtros
└── pages/
    └── receitas/
        └── Receitas.tsx              # Página principal
```

## Testes de Integração com Supabase

### 1. Teste de Criação
```typescript
// Criar uma receita
const novaReceita = {
  descricao: "Salário Novembro",
  valor: 5000.00,
  data: "2025-11-01",
  categoria: "Salário",
  recorrente: true,
  frequencia_recorrencia: "mensal",
  observacoes: "Pagamento mensal"
};

await receitasService.create(novaReceita);
// ✅ Verifica se a receita foi criada no banco
// ✅ Verifica se RLS permite apenas o usuário logado criar
```

### 2. Teste de Listagem com Filtros
```typescript
// Listar receitas do mês atual
const filters = {
  dataInicio: "2025-11-01",
  dataFim: "2025-11-30"
};

const result = await receitasService.list(filters, 1, 10);
// ✅ Verifica se retorna apenas receitas do usuário logado (RLS)
// ✅ Verifica paginação
// ✅ Verifica filtros aplicados
```

### 3. Teste de Atualização
```typescript
// Atualizar valor de uma receita
await receitasService.update(receitaId, {
  valor: 5500.00,
  observacoes: "Valor atualizado com bônus"
});
// ✅ Verifica se RLS permite apenas o dono atualizar
// ✅ Verifica se campos foram atualizados
```

### 4. Teste de Exclusão
```typescript
// Deletar uma receita
await receitasService.delete(receitaId);
// ✅ Verifica se RLS permite apenas o dono deletar
// ✅ Verifica se registro foi removido
```

## Demonstração de RLS (Row Level Security)

### Políticas RLS Aplicadas

```sql
-- Política de SELECT: Usuário vê apenas suas próprias receitas
CREATE POLICY "Users can view own receitas"
ON receitas FOR SELECT
USING (auth.uid() = user_id);

-- Política de INSERT: Usuário pode criar receitas para si mesmo
CREATE POLICY "Users can insert own receitas"
ON receitas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política de UPDATE: Usuário pode atualizar apenas suas receitas
CREATE POLICY "Users can update own receitas"
ON receitas FOR UPDATE
USING (auth.uid() = user_id);

-- Política de DELETE: Usuário pode deletar apenas suas receitas
CREATE POLICY "Users can delete own receitas"
ON receitas FOR DELETE
USING (auth.uid() = user_id);
```

### Teste Manual de RLS

1. **Login com Usuário A**
   - Criar 3 receitas
   - Verificar que aparecem na lista

2. **Logout e Login com Usuário B**
   - Verificar que a lista está vazia (não vê receitas do Usuário A)
   - Criar 2 receitas
   - Verificar que aparecem apenas as 2 receitas do Usuário B

3. **Tentar acessar receita de outro usuário via API**
   ```typescript
   // Tentar buscar receita do Usuário A estando logado como Usuário B
   const receita = await receitasService.getById(receitaIdDoUsuarioA);
   // ❌ Deve retornar erro ou null (RLS bloqueia)
   ```

4. **Tentar atualizar receita de outro usuário**
   ```typescript
   // Tentar atualizar receita do Usuário A estando logado como Usuário B
   await receitasService.update(receitaIdDoUsuarioA, { valor: 9999 });
   // ❌ Deve retornar erro (RLS bloqueia)
   ```

### Verificação de RLS no Console do Supabase

1. Acessar **Table Editor** > **receitas**
2. Verificar que a coluna `user_id` está preenchida com o UUID do usuário
3. Acessar **Authentication** > **Users**
4. Comparar o `user_id` das receitas com o `id` dos usuários
5. Confirmar que cada receita pertence ao usuário correto

## Categorias Disponíveis

- Salário
- Freelance
- Investimentos
- Aluguel
- Vendas
- Bonificação
- Outros

## Frequências de Recorrência

- Semanal
- Mensal
- Anual

## Validações Implementadas

- ✅ Descrição não pode ser vazia
- ✅ Valor deve ser maior que zero
- ✅ Data é obrigatória
- ✅ Se recorrente = true, frequência é obrigatória
- ✅ Categoria deve ser uma das opções predefinidas

## Dark Mode

Todos os componentes suportam dark mode:
- Formulário modal
- Tabela de listagem
- Filtros
- Cards de estatísticas
- Botões e inputs

## Responsividade

- ✅ Mobile: Tabela com scroll horizontal
- ✅ Tablet: Layout adaptado
- ✅ Desktop: Layout completo com todas as colunas

## Próximos Passos Sugeridos

1. Implementar exportação de receitas (CSV/PDF)
2. Adicionar gráficos de receitas por categoria
3. Implementar busca avançada
4. Adicionar anexos/comprovantes
5. Criar dashboard de receitas recorrentes
