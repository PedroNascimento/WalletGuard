# 🐛 Correção: Problema ao Criar Receitas

## Problema Identificado

Ao tentar cadastrar uma nova receita e clicar no botão "Criar Receita", a ação não estava sendo registrada no banco de dados.

## Causa Raiz

O campo `user_id` não estava sendo enviado automaticamente ao criar uma receita. A tabela `receitas` no Supabase requer o `user_id` (chave estrangeira obrigatória), mas o formulário não estava incluindo esse campo nos dados enviados.

### Erro Esperado no Console

```
Error: new row violates row-level security policy for table "receitas"
```

ou

```
Error: null value in column "user_id" violates not-null constraint
```

## Solução Implementada

Atualizei o método `create` no arquivo `src/services/receitas.service.ts` para:

1. **Obter o usuário autenticado** da sessão do Supabase
2. **Adicionar automaticamente o `user_id`** aos dados da receita
3. **Validar** se o usuário está autenticado antes de tentar criar

### Código Anterior (❌ Com problema)

```typescript
async create(receita: ReceitaFormData) {
  const { data, error } = await supabase
    .from('receitas')
    .insert([receita])  // ❌ Faltava o user_id
    .select()
    .single();

  if (error) {
    throw error;
  }

  await this.refreshMonthlySummary();
  return data as Receita;
}
```

### Código Atual (✅ Corrigido)

```typescript
async create(receita: ReceitaFormData) {
  // Obter o usuário autenticado
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  // Adicionar user_id aos dados
  const receitaComUserId = {
    ...receita,
    user_id: user.id  // ✅ user_id adicionado automaticamente
  };

  const { data, error } = await supabase
    .from('receitas')
    .insert([receitaComUserId])
    .select()
    .single();

  if (error) {
    throw error;
  }

  await this.refreshMonthlySummary();
  return data as Receita;
}
```

## Benefícios da Correção

1. ✅ **Segurança**: O `user_id` é sempre obtido da sessão autenticada, não pode ser falsificado
2. ✅ **Simplicidade**: O formulário não precisa se preocupar com o `user_id`
3. ✅ **Consistência**: Todas as receitas terão o `user_id` correto automaticamente
4. ✅ **RLS Compatível**: Funciona perfeitamente com as políticas de Row Level Security

## Como Testar

1. **Faça login** na aplicação
2. **Acesse** a página de Receitas (`/receitas`)
3. **Clique** em "Nova Receita"
4. **Preencha** o formulário:
   - Descrição: "Teste de Receita"
   - Valor: 100
   - Data: Data atual
   - Categoria: Salário
5. **Clique** em "Criar Receita"
6. ✅ A receita deve ser criada com sucesso
7. ✅ Você deve ver a receita na lista
8. ✅ No Supabase, o `user_id` deve estar preenchido corretamente

## Verificação no Supabase

1. Acesse o **Table Editor** > **receitas**
2. Verifique que a nova receita foi criada
3. Confirme que o campo `user_id` corresponde ao seu ID de usuário
4. Verifique em **Authentication** > **Users** para comparar os IDs

## Outras Correções Relacionadas

### Logout Implementado

Também foi corrigido o problema de logout que não redirecionava para a tela de login:

**Arquivo**: `src/components/layout/Sidebar.tsx`

```typescript
const handleLogout = async () => {
  await signOut();
  navigate('/login');  // ✅ Redirecionamento adicionado
};
```

### Script `start` Adicionado

Foi adicionado o script `start` ao `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "start": "vite preview"  // ✅ Novo script
  }
}
```

Agora você pode usar:
- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Preview da build

## Status

✅ **Problema resolvido**  
✅ **Build compilando sem erros**  
✅ **Pronto para teste**

---

**Data da correção**: 26/11/2025  
**Arquivos modificados**:
- `src/services/receitas.service.ts`
- `src/components/layout/Sidebar.tsx`
- `package.json`
