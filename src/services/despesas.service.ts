import { supabase } from './supabase';
import type { Despesa, DespesaFormData, DespesaFilters } from '../types/despesa';

export const despesasService = {
    // Listar despesas com filtros e paginação
    async list(
        filters: DespesaFilters = {},
        page: number = 1,
        pageSize: number = 10
    ) {
        let query = supabase
            .from('expenses')
            .select('*', { count: 'exact' })
            .order('date', { ascending: false });

        // Aplicar filtros
        if (filters.dataInicio) {
            query = query.gte('date', filters.dataInicio);
        }
        if (filters.dataFim) {
            query = query.lte('date', filters.dataFim);
        }
        if (filters.categoria) {
            query = query.eq('category', filters.categoria);
        }
        if (filters.tipo) {
            query = query.eq('type', filters.tipo);
        }
        if (filters.search) {
            query = query.ilike('description', `%${filters.search}%`);
        }

        // Paginação
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        // Mapear campos do banco para o formato da aplicação
        const despesas = (data || []).map(item => ({
            id: item.id,
            user_id: item.user_id,
            descricao: item.description || '',
            valor: item.value || 0,
            data: item.date,
            categoria: item.category || '',
            tipo: item.type || 'variavel',
            recorrente: item.recurring || false,
            frequencia_recorrencia: item.recurring_frequency,
            observacoes: item.notes,
            created_at: item.created_at,
            updated_at: item.updated_at
        }));

        return {
            data: despesas as Despesa[],
            count: count || 0,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize)
        };
    },

    // Buscar despesa por ID
    async getById(id: string) {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        // Mapear campos
        const despesa = {
            id: data.id,
            user_id: data.user_id,
            descricao: data.description || '',
            valor: data.value || 0,
            data: data.date,
            categoria: data.category || '',
            tipo: data.type || 'variavel',
            recorrente: data.recurring || false,
            frequencia_recorrencia: data.recurring_frequency,
            observacoes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at
        };

        return despesa as Despesa;
    },

    // Criar nova despesa
    async create(despesa: DespesaFormData) {
        // Obter o usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuário não autenticado');
        }

        // Mapear para o formato do banco
        const despesaParaBanco: any = {
            user_id: user.id,
            description: despesa.descricao,
            value: despesa.valor,
            date: despesa.data,
            category: despesa.categoria,
            type: despesa.tipo,
            recurring: despesa.recorrente
        };

        // Adicionar campos opcionais apenas se existirem na tabela
        if (despesa.frequencia_recorrencia) {
            despesaParaBanco.recurring_frequency = despesa.frequencia_recorrencia;
        }
        if (despesa.observacoes) {
            despesaParaBanco.notes = despesa.observacoes;
        }

        const { data, error } = await supabase
            .from('expenses')
            .insert([despesaParaBanco])
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Mapear resposta
        const despesaCriada = {
            id: data.id,
            user_id: data.user_id,
            descricao: data.description || '',
            valor: data.value || 0,
            data: data.date,
            categoria: data.category || '',
            tipo: data.type || 'variavel',
            recorrente: data.recurring || false,
            frequencia_recorrencia: data.recurring_frequency,
            observacoes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at
        };

        return despesaCriada as Despesa;
    },

    // Atualizar despesa existente
    async update(id: string, despesa: Partial<DespesaFormData>) {
        // Mapear para o formato do banco
        const despesaParaBanco: any = {};
        if (despesa.descricao !== undefined) despesaParaBanco.description = despesa.descricao;
        if (despesa.valor !== undefined) despesaParaBanco.value = despesa.valor;
        if (despesa.data !== undefined) despesaParaBanco.date = despesa.data;
        if (despesa.categoria !== undefined) despesaParaBanco.category = despesa.categoria;
        if (despesa.tipo !== undefined) despesaParaBanco.type = despesa.tipo;
        if (despesa.recorrente !== undefined) despesaParaBanco.recurring = despesa.recorrente;
        if (despesa.frequencia_recorrencia !== undefined) despesaParaBanco.recurring_frequency = despesa.frequencia_recorrencia;
        if (despesa.observacoes !== undefined) despesaParaBanco.notes = despesa.observacoes;

        const { data, error } = await supabase
            .from('expenses')
            .update(despesaParaBanco)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        // Mapear resposta
        const despesaAtualizada = {
            id: data.id,
            user_id: data.user_id,
            descricao: data.description || '',
            valor: data.value || 0,
            data: data.date,
            categoria: data.category || '',
            tipo: data.type || 'variavel',
            recorrente: data.recurring || false,
            frequencia_recorrencia: data.recurring_frequency,
            observacoes: data.notes,
            created_at: data.created_at,
            updated_at: data.updated_at
        };

        return despesaAtualizada as Despesa;
    },

    // Deletar despesa
    async delete(id: string) {
        const { error, count } = await supabase
            .from('expenses')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) {
            throw error;
        }

        if (count === 0) {
            throw new Error('Erro ao excluir: Registro não encontrado ou sem permissão.');
        }

        if (error) {
            throw error;
        }

        return true;
    },

    // Obter estatísticas de despesas
    async getStats(dataInicio?: string, dataFim?: string) {
        let query = supabase
            .from('expenses')
            .select('value, category, type, recurring');

        if (dataInicio) {
            query = query.gte('date', dataInicio);
        }
        if (dataFim) {
            query = query.lte('date', dataFim);
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        const total = data.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
        const fixas = data.filter((d: any) => d.type === 'fixa').length;
        const variaveis = data.filter((d: any) => d.type === 'variavel').length;
        const recorrentes = data.filter((d: any) => d.recurring).length;
        const porCategoria = data.reduce((acc: Record<string, number>, d: any) => {
            const cat = d.category || 'Outros';
            acc[cat] = (acc[cat] || 0) + (d.value || 0);
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            fixas,
            variaveis,
            recorrentes,
            porCategoria,
            quantidade: data.length
        };
    }
};
