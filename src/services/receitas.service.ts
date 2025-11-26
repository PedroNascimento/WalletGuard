import { supabase } from './supabase';
import type { Receita, ReceitaFormData, ReceitaFilters } from '../types/receita';

export const receitasService = {
    // Listar receitas com filtros e paginação
    async list(
        filters: ReceitaFilters = {},
        page: number = 1,
        pageSize: number = 10
    ) {
        let query = supabase
            .from('receitas')
            .select('*', { count: 'exact' })
            .order('data', { ascending: false });

        // Aplicar filtros
        if (filters.dataInicio) {
            query = query.gte('data', filters.dataInicio);
        }
        if (filters.dataFim) {
            query = query.lte('data', filters.dataFim);
        }
        if (filters.categoria) {
            query = query.eq('categoria', filters.categoria);
        }
        if (filters.search) {
            query = query.ilike('descricao', `%${filters.search}%`);
        }

        // Paginação
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        return {
            data: data as Receita[],
            count: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize)
        };
    },

    // Buscar receita por ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('receitas')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return data as Receita;
    },

    // Criar nova receita
    async create(receita: ReceitaFormData) {
        // Obter o usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        // Adicionar user_id aos dados
        const receitaComUserId = {
            ...receita,
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('receitas')
            .insert([receitaComUserId])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Atualizar view de resumo mensal
        await this.refreshMonthlySummary();

        return data as Receita;
    },

    // Atualizar receita existente
    async update(id: string, receita: Partial<ReceitaFormData>) {
        const { data, error } = await supabase
            .from('receitas')
            .update(receita)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Atualizar view de resumo mensal
        await this.refreshMonthlySummary();

        return data as Receita;
    },

    // Deletar receita
    async delete(id: string) {
        const { error } = await supabase
            .from('receitas')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }

        // Atualizar view de resumo mensal
        await this.refreshMonthlySummary();

        return true;
    },

    // Atualizar view de resumo mensal (refresh materialized view se necessário)
    async refreshMonthlySummary() {
        // Se vw_monthly_summary for uma materialized view, você pode fazer refresh aqui
        // Por enquanto, como é uma view normal, ela será atualizada automaticamente
        // Caso precise forçar atualização de cache ou similar, implemente aqui
        return true;
    },

    // Obter estatísticas de receitas
    async getStats(dataInicio?: string, dataFim?: string) {
        let query = supabase
            .from('receitas')
            .select('valor, categoria, recorrente');

        if (dataInicio) {
            query = query.gte('data', dataInicio);
        }
        if (dataFim) {
            query = query.lte('data', dataFim);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const total = data.reduce((sum: number, r: any) => sum + r.valor, 0);
        const recorrentes = data.filter((r: any) => r.recorrente).length;
        const porCategoria = data.reduce((acc: Record<string, number>, r: any) => {
            acc[r.categoria] = (acc[r.categoria] || 0) + r.valor;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            recorrentes,
            porCategoria,
            quantidade: data.length
        };
    }
};
