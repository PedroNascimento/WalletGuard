# Configuração do Supabase Storage para Avatares

Para permitir o upload de fotos de perfil, precisamos criar um bucket público chamado `avatars`.

## 1. Criar Bucket
Rode o seguinte SQL no Editor SQL do Supabase:

```sql
-- Criar bucket 'avatars' se não existir
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Política de SELECT (Público)
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Política de INSERT (Apenas usuário autenticado)
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Política de UPDATE (Apenas o próprio usuário)
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' AND auth.uid() = owner );
```
