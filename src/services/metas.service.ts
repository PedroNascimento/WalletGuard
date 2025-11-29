import { supabase } from './supabase';
import type { Meta, MetaFormData, MetaContribuicao } from '../types/meta';

export const metasService = {
    // Listar todas as metas do usuário
    async getAll(): Promise<Meta[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('metas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Buscar meta por ID
    async getById(id: string): Promise<Meta> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('metas')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    // Criar nova meta
    async create(formData: MetaFormData): Promise<Meta> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('metas')
            .insert([{
                user_id: user.id,
                ...formData,
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Atualizar meta
    async update(id: string, formData: Partial<MetaFormData>): Promise<Meta> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('metas')
            .update(formData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Deletar meta
    async delete(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('metas')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    // Adicionar contribuição
    async addContribuicao(metaId: string, valor: number, observacao?: string): Promise<MetaContribuicao> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('meta_contribuicoes')
            .insert([{
                meta_id: metaId,
                user_id: user.id,
                valor,
                observacao,
                data: new Date().toISOString().split('T')[0],
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Listar contribuições de uma meta
    async getContribuicoes(metaId: string): Promise<MetaContribuicao[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('meta_contribuicoes')
            .select('*')
            .eq('meta_id', metaId)
            .eq('user_id', user.id)
            .order('data', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Estatísticas
    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: metas, error } = await supabase
            .from('metas')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        const total = metas?.length || 0;
        const concluidas = metas?.filter(m => m.status === 'concluida').length || 0;
        const emAndamento = metas?.filter(m => m.status === 'em_andamento').length || 0;
        const atrasadas = metas?.filter(m => m.status === 'atrasada').length || 0;

        const valorTotal = metas?.reduce((sum, m) => sum + Number(m.valor_alvo), 0) || 0;
        const valorAtual = metas?.reduce((sum, m) => sum + Number(m.valor_atual), 0) || 0;
        const progresso = valorTotal > 0 ? (valorAtual / valorTotal) * 100 : 0;

        return {
            total,
            concluidas,
            emAndamento,
            atrasadas,
            valorTotal,
            valorAtual,
            progresso: Math.round(progresso * 10) / 10,
        };
    },
};
