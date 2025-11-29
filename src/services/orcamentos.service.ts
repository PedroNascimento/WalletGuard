import { supabase } from './supabase';
import type { Orcamento, OrcamentoFormData } from '../types/orcamento';

export const orcamentosService = {
    // Listar todos os orçamentos do usuário
    async getAll(): Promise<Orcamento[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('orcamentos')
            .select('*')
            .eq('user_id', user.id)
            .order('ano', { ascending: false })
            .order('mes', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Buscar orçamento por ID
    async getById(id: string): Promise<Orcamento> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('orcamentos')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    // Buscar orçamento por mês/ano
    async getByMesAno(mes: number, ano: number): Promise<Orcamento | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('orcamentos')
            .select('*')
            .eq('user_id', user.id)
            .eq('mes', mes)
            .eq('ano', ano)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    // Criar novo orçamento
    async create(formData: OrcamentoFormData): Promise<Orcamento> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('orcamentos')
            .insert([{
                user_id: user.id,
                ...formData,
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Atualizar orçamento
    async update(id: string, formData: Partial<OrcamentoFormData>): Promise<Orcamento> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('orcamentos')
            .update(formData)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Deletar orçamento
    async delete(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { error } = await supabase
            .from('orcamentos')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
    },

    // Sincronizar valor gasto com despesas reais
    async syncValorGasto(mes: number, ano: number): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Chamar função SQL para sincronizar
        const { error } = await supabase.rpc('sync_orcamento_valor_gasto', {
            p_user_id: user.id,
            p_mes: mes,
            p_ano: ano,
        });

        if (error) throw error;
    },

    // Obter orçamento atual (mês/ano atual)
    async getCurrent(): Promise<Orcamento | null> {
        const now = new Date();
        const mes = now.getMonth() + 1;
        const ano = now.getFullYear();

        return this.getByMesAno(mes, ano);
    },

    // Estatísticas
    async getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data: orcamentos, error } = await supabase
            .from('orcamentos')
            .select('*')
            .eq('user_id', user.id);

        if (error) throw error;

        const total = orcamentos?.length || 0;
        const ativos = orcamentos?.filter(o => o.status === 'ativo').length || 0;
        const excedidos = orcamentos?.filter(o => o.status === 'excedido').length || 0;

        // Orçamento atual
        const now = new Date();
        const orcamentoAtual = orcamentos?.find(
            o => o.mes === now.getMonth() + 1 && o.ano === now.getFullYear()
        );

        const valorPlanejado = orcamentoAtual?.valor_total || 0;
        const valorGasto = orcamentoAtual?.valor_gasto || 0;
        const saldo = valorPlanejado - valorGasto;
        const percentualGasto = valorPlanejado > 0 ? (valorGasto / valorPlanejado) * 100 : 0;

        return {
            total,
            ativos,
            excedidos,
            orcamentoAtual: orcamentoAtual || null,
            valorPlanejado,
            valorGasto,
            saldo,
            percentualGasto: Math.round(percentualGasto * 10) / 10,
        };
    },
};
