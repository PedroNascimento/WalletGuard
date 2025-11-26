# 📉 Módulo de Despesas - WalletGuard

## 📋 Visão Geral

O módulo de Despesas permite gerenciar todas as suas despesas de forma organizada e eficiente, com suporte a categorização, recorrência e filtros avançados.

---

## ✨ Funcionalidades

### CRUD Completo
- ✅ **Criar** despesas com validação
- ✅ **Listar** despesas com paginação (10 itens/página)
- ✅ **Editar** despesas existentes
- ✅ **Deletar** despesas com confirmação

### Filtros Avançados
- ✅ Busca por descrição
- ✅ Filtro por período (data início/fim)
- ✅ Filtro por categoria
- ✅ Filtro por tipo (fixa/variável)

### Estatísticas
- ✅ Total de despesas
- ✅ Quantidade de despesas fixas
- ✅ Quantidade de despesas variáveis
- ✅ Despesas recorrentes
- ✅ Total por categoria

### Recorrência
- ✅ Suporte a despesas recorrentes
- ✅ Frequências: Semanal, Mensal, Anual
- ✅ Indicador visual de recorrência

---

## 🎨 Interface

### Cards de Estatísticas
1. **Total de Despesas** - Valor total em vermelho
2. **Despesas Fixas** - Contagem em laranja
3. **Despesas Variáveis** - Contagem em roxo
4. **Recorrentes** - Contagem em azul

### Tabela de Despesas
- Descrição (com observações)
- Categoria (badge colorido)
- Tipo (Fixa/Variável com badge)
- Valor (em vermelho)
- Data
- Recorrência (ícone + frequência)
- Ações (Editar/Deletar)

---

## 📊 Categorias Disponíveis

1. **Alimentação** - Supermercado, restaurantes, delivery
2. **Transporte** - Combustível, transporte público, manutenção
3. **Moradia** - Aluguel, condomínio, IPTU
4. **Saúde** - Plano de saúde, medicamentos, consultas
5. **Educação** - Mensalidades, cursos, livros
6. **Lazer** - Entretenimento, viagens, hobbies
7. **Vestuário** - Roupas, calçados, acessórios
8. **Serviços** - Internet, telefone, streaming
9. **Impostos** - IR, IPVA, taxas
10. **Outros** - Despesas diversas

---

## 🔄 Tipos de Despesa

### Fixa
Despesas que se repetem com o mesmo valor todos os meses.

**Exemplos:**
- Aluguel
- Plano de saúde
- Mensalidade escolar
- Assinaturas

### Variável
Despesas que variam de valor a cada mês.

**Exemplos:**
- Supermercado
- Combustível
- Contas de consumo (luz, água)
- Lazer

---

## 🔁 Recorrência

### Como Funciona
Ao marcar uma despesa como recorrente, você indica que ela se repete regularmente.

### Frequências
- **Semanal** - Repete toda semana
- **Mensal** - Repete todo mês
- **Anual** - Repete todo ano

**Nota:** A recorrência é apenas um indicador. O sistema não cria automaticamente novas despesas.

---

## 🗂️ Estrutura de Arquivos

```
src/
├── types/
│   └── despesa.ts                    # Tipos TypeScript
├── services/
│   └── despesas.service.ts           # Service com CRUD
├── components/
│   └── despesas/
│       ├── DespesaForm.tsx           # Formulário modal
│       └── DespesaFilters.tsx        # Componente de filtros
└── pages/
    └── despesas/
        └── Despesas.tsx              # Página principal
```

---

## 🔧 Uso

### Criar Nova Despesa

1. Clique em **"Nova Despesa"**
2. Preencha o formulário:
   - **Descrição** (obrigatório)
   - **Valor** (obrigatório, > 0)
   - **Data** (obrigatório)
   - **Categoria** (seleção)
   - **Tipo** (Fixa/Variável)
   - **Recorrente** (checkbox)
   - **Frequência** (se recorrente)
   - **Observações** (opcional)
3. Clique em **"Criar Despesa"**

### Editar Despesa

1. Clique no ícone de **editar** (lápis)
2. Modifique os campos desejados
3. Clique em **"Atualizar Despesa"**

### Deletar Despesa

1. Clique no ícone de **deletar** (lixeira)
2. Confirme a exclusão
3. A despesa será removida

### Filtrar Despesas

1. Use a barra de **busca** para procurar por descrição
2. Selecione **período** (data início/fim)
3. Escolha uma **categoria** específica
4. Filtre por **tipo** (Fixa/Variável)
5. Clique em **"Limpar Filtros"** para resetar

---

## 💾 Integração com Banco de Dados

### Tabela: `expenses`

O módulo utiliza a tabela `expenses` do Supabase com os seguintes campos:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | uuid | ID único |
| `user_id` | uuid | ID do usuário |
| `description` | text | Descrição |
| `value` | numeric | Valor |
| `date` | date | Data |
| `category` | text | Categoria |
| `type` | text | Tipo (fixa/variavel) |
| `recurring` | boolean | Recorrente |
| `frequency` | text | Frequência |
| `notes` | text | Observações |
| `created_at` | timestamptz | Data de criação |
| `updated_at` | timestamptz | Data de atualização |

### Mapeamento de Campos

O service faz o mapeamento automático entre os nomes em português (aplicação) e inglês (banco):

```typescript
// Aplicação → Banco
descricao → description
valor → value
data → date
categoria → category
tipo → type
recorrente → recurring
frequencia_recorrencia → frequency
observacoes → notes
```

---

## 🔒 Segurança

### Row Level Security (RLS)

Todas as despesas são protegidas por RLS:

- ✅ Usuários veem apenas suas próprias despesas
- ✅ Não é possível acessar despesas de outros usuários
- ✅ `user_id` é injetado automaticamente ao criar

### Validações

#### Frontend
- Descrição obrigatória
- Valor > 0
- Data obrigatória
- Frequência obrigatória se recorrente

#### Backend
- Foreign key para `auth.users`
- Check constraint no tipo
- Check constraint na frequência

---

## 📱 Responsividade

O módulo é totalmente responsivo:

- **Mobile** (< 768px) - Cards empilhados, tabela com scroll
- **Tablet** (768px - 1024px) - Grid 2 colunas
- **Desktop** (> 1024px) - Grid 4 colunas, tabela completa

---

## 🎨 Dark Mode

Todos os componentes suportam dark mode:

- ✅ Cores adaptativas
- ✅ Contraste adequado
- ✅ Ícones visíveis
- ✅ Badges legíveis

---

## 🔄 Atualização Automática

Ao criar, editar ou deletar uma despesa:

1. ✅ Lista de despesas é recarregada
2. ✅ Estatísticas são recalculadas
3. ✅ Dashboard é atualizado automaticamente (via RLS)

---

## 🐛 Tratamento de Erros

### Erros Comuns

1. **"Usuário não autenticado"**
   - Solução: Faça login novamente

2. **"Erro ao carregar despesas"**
   - Solução: Verifique sua conexão com a internet

3. **"Erro ao criar despesa"**
   - Solução: Verifique se todos os campos obrigatórios estão preenchidos

4. **"Could not find the table 'public.expenses'"**
   - Solução: Execute o schema SQL no Supabase

---

## 📈 Próximas Melhorias

- [ ] Importação de despesas via CSV
- [ ] Exportação de relatórios
- [ ] Gráficos de evolução
- [ ] Alertas de gastos excessivos
- [ ] Orçamento por categoria
- [ ] Comparação mês a mês
- [ ] Despesas parceladas
- [ ] Anexos (notas fiscais)

---

## 🤝 Integração com Outros Módulos

### Dashboard
- Total de despesas do mês
- Saldo (receitas - despesas)
- Transações recentes

### Relatórios (futuro)
- Gráficos de despesas por categoria
- Evolução mensal
- Comparação de períodos

### Cartões (futuro)
- Despesas vinculadas a cartões
- Fatura do cartão

---

## 📝 Exemplo de Uso

```typescript
import { despesasService } from './services/despesas.service';

// Criar despesa
const novaDespesa = await despesasService.create({
  descricao: 'Conta de luz',
  valor: 150.00,
  data: '2025-11-26',
  categoria: 'Moradia',
  tipo: 'variavel',
  recorrente: true,
  frequencia_recorrencia: 'mensal',
  observacoes: 'Vencimento dia 10'
});

// Listar com filtros
const resultado = await despesasService.list({
  categoria: 'Alimentação',
  dataInicio: '2025-11-01',
  dataFim: '2025-11-30'
}, 1, 10);

// Obter estatísticas
const stats = await despesasService.getStats('2025-11-01', '2025-11-30');
console.log(`Total: R$ ${stats.total}`);
```

---

## ✅ Status

**Implementação:** ✅ 100% Completo  
**Testes:** ⏳ Pendente  
**Documentação:** ✅ Completo

---

**Desenvolvido com ❤️ para WalletGuard**
