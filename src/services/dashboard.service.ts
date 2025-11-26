import { supabase } from './supabase';

export const dashboardService = {
    // Obter resumo financeiro do mês atual
    async getCurrentMonthSummary() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        // Buscar receitas do mês
        const { data: receitas, error: receitasError } = await supabase
            .from('receitas')
            .select('valor')
            .gte('data', firstDay)
            .lte('data', lastDay);

        if (receitasError) throw receitasError;

        // Buscar despesas do mês
        const { data: despesas, error: despesasError } = await supabase
            .from('expenses')
            .select('value')
            .gte('date', firstDay)
            .lte('date', lastDay);

        if (despesasError) throw despesasError;

        // Calcular totais
        const totalReceitas = receitas?.reduce((sum, r) => sum + Number(r.valor), 0) || 0;
        const totalDespesas = despesas?.reduce((sum, d) => sum + Number(d.value), 0) || 0;
        const saldo = totalReceitas - totalDespesas;

        return {
            totalReceitas,
            totalDespesas,
            saldo,
            percentualVariacao: totalReceitas > 0 ? ((saldo / totalReceitas) * 100) : 0
        };
    },

    // Obter total de cartões ativos
    async getActiveCardsCount() {
        const { count, error } = await supabase
            .from('cards')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        return count || 0;
    },

    // Obter fatura total dos cartões
    async getCardsTotalBill() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('card_expenses')
            .select('value')
            .gte('date', firstDay)
            .lte('date', lastDay);

        if (error) throw error;

        const total = data?.reduce((sum, expense) => sum + Number(expense.value), 0) || 0;

        return total;
    },

    // Obter transações recentes (últimas 10)
    async getRecentTransactions() {
        // Buscar receitas recentes
        const { data: receitasData, error: receitasError } = await supabase
            .from('receitas')
            .select('id, descricao, valor, data, categoria')
            .order('data', { ascending: false })
            .limit(5);

        if (receitasError) throw receitasError;

        // Buscar despesas recentes
        const { data: despesasData, error: despesasError } = await supabase
            .from('expenses')
            .select('id, description, value, date, category')
            .order('date', { ascending: false })
            .limit(5);

        if (despesasError) throw despesasError;

        // Combinar e formatar
        const receitas = (receitasData || []).map(r => ({
            id: r.id,
            type: 'receita' as const,
            description: r.descricao,
            value: Number(r.valor),
            date: r.data,
            category: r.categoria
        }));

        const despesas = (despesasData || []).map(d => ({
            id: d.id,
            type: 'despesa' as const,
            description: d.description || 'Despesa',
            value: Number(d.value),
            date: d.date,
            category: d.category || 'Outros'
        }));

        // Combinar e ordenar por data
        const allTransactions = [...receitas, ...despesas]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        return allTransactions;
    },

    // Obter resumo por categoria
    async getCategorySummary() {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        // Receitas por categoria
        const { data: receitasData, error: receitasError } = await supabase
            .from('receitas')
            .select('categoria, valor')
            .gte('data', firstDay)
            .lte('data', lastDay);

        if (receitasError) throw receitasError;

        // Despesas por categoria
        const { data: despesasData, error: despesasError } = await supabase
            .from('expenses')
            .select('category, value')
            .gte('date', firstDay)
            .lte('date', lastDay);

        if (despesasError) throw despesasError;

        // Agrupar receitas
        const receitasPorCategoria = (receitasData || []).reduce((acc: Record<string, number>, r: any) => {
            const cat = r.categoria || 'Outros';
            acc[cat] = (acc[cat] || 0) + Number(r.valor);
            return acc;
        }, {});

        // Agrupar despesas
        const despesasPorCategoria = (despesasData || []).reduce((acc: Record<string, number>, d: any) => {
            const cat = d.category || 'Outros';
            acc[cat] = (acc[cat] || 0) + Number(d.value);
            return acc;
        }, {});

        return {
            receitas: receitasPorCategoria,
            despesas: despesasPorCategoria
        };
    }
};
