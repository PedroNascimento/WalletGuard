import { supabase } from './supabase';
import type { Card, CardFormData, CardExpense, CardExpenseFormData, InvoiceSummary } from '../types/card';

export const cardsService = {
    // --- CRUD de Cartões ---

    async list() {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Card[];
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from('cards')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Card;
    },

    async create(card: CardFormData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const { data, error } = await supabase
            .from('cards')
            .insert([{
                user_id: user.id,
                ...card
            }])
            .select()
            .single();

        if (error) throw error;
        return data as Card;
    },

    async update(id: string, card: Partial<CardFormData>) {
        const { data, error } = await supabase
            .from('cards')
            .update(card)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Card;
    },

    async delete(id: string) {
        const { error, count } = await supabase
            .from('cards')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) throw error;
        if (count === 0) throw new Error('Erro ao excluir: Cartão não encontrado ou sem permissão.');
        return true;
    },

    // --- Gastos e Faturas ---

    async createExpense(cardId: string, expenseData: CardExpenseFormData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        const expenses = [];
        const baseDate = new Date(expenseData.date);
        // Ajuste para fuso horário local para evitar problemas de data
        baseDate.setMinutes(baseDate.getMinutes() + baseDate.getTimezoneOffset());

        const installmentValue = Number((expenseData.value / expenseData.installments).toFixed(2));

        // Ajuste da última parcela para bater o valor total exato
        const totalDistributed = installmentValue * expenseData.installments;
        const diff = Number((expenseData.value - totalDistributed).toFixed(2));

        for (let i = 0; i < expenseData.installments; i++) {
            const date = new Date(baseDate);
            date.setMonth(date.getMonth() + i);

            let value = installmentValue;
            if (i === expenseData.installments - 1) {
                value += diff; // Soma a diferença na última parcela
            }

            expenses.push({
                user_id: user.id,
                card_id: cardId,
                description: expenseData.installments > 1 ? `${expenseData.description} (${i + 1}/${expenseData.installments})` : expenseData.description,
                value: value,
                date: date.toISOString().split('T')[0],
                category: expenseData.category,
                installments: expenseData.installments,
                installment_current: i + 1,
                original_amount: expenseData.value
            });
        }

        const { error } = await supabase.from('card_expenses').insert(expenses);
        if (error) throw error;
    },

    async getExpenses(cardId: string, month: number, year: number) {
        // 1. Buscar dados do cartão para saber dia de fechamento
        const card = await this.getById(cardId);
        if (!card) throw new Error('Cartão não encontrado');

        // 2. Calcular intervalo da fatura
        // Ex: Fechamento dia 5. Fatura de Março (3) vai de 06/Fev a 05/Mar.
        // Se fechamento >= dia 28, consideramos mês fechado (1 a 31).

        let startDate: Date;
        let endDate: Date;

        const closingDay = card.closing_day;

        // Data de vencimento da fatura (referência)
        // Se a fatura é de "Março", ela vence em Março.
        // O fechamento é em Março (se closing < due) ou Fevereiro (se closing > due)?
        // Geralmente: Fechamento dia 25, Vencimento dia 5 do mês seguinte.
        // Fatura de "Abril" (vence 05/04) fecha em 25/03.
        // Intervalo: 26/02 a 25/03.

        // Vamos simplificar: O usuário seleciona "Fatura de Março".
        // Isso significa a fatura que VENCE em Março.

        const dueDate = new Date(year, month - 1, card.due_day);

        // Calcular data de fechamento desta fatura
        // Se closing_day < due_day, fecha no mesmo mês.
        // Se closing_day > due_day, fecha no mês anterior (estranho, geralmente due > closing).
        // Padrão: Fechamento dia X, Vencimento dia Y. Geralmente Y = X + 10.
        // Se X=25, Y=5 (mês seguinte).

        // Vamos assumir que "Fatura de Mês M" é a que tem VENCIMENTO no mês M.

        let closingDate = new Date(year, month - 1, closingDay);

        // Se o dia de fechamento for DEPOIS do dia de vencimento, então o fechamento foi no mês anterior.
        // Ex: Vence dia 5, Fecha dia 25.
        // Fatura de Março (05/03): Fechou em 25/02.
        if (closingDay > card.due_day) {
            closingDate = new Date(year, month - 2, closingDay);
        }

        // Data de início: Dia seguinte ao fechamento da fatura anterior
        startDate = new Date(closingDate);
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setDate(startDate.getDate() + 1);

        // Data fim: Dia do fechamento
        endDate = closingDate;

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = endDate.toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('card_expenses')
            .select('*')
            .eq('card_id', cardId)
            .gte('date', startStr)
            .lte('date', endStr)
            .order('date', { ascending: false });

        if (error) throw error;

        const total = (data || []).reduce((acc, curr) => acc + Number(curr.value), 0);

        return {
            expenses: data as CardExpense[],
            summary: {
                month,
                year,
                total,
                status: new Date() > closingDate ? 'closed' : 'open',
                dueDate: dueDate.toISOString().split('T')[0],
                closingDate: closingDate.toISOString().split('T')[0]
            } as InvoiceSummary
        };
    },

    async getInvoiceHistory(cardId: string) {
        // Retorna resumo das próximas 12 faturas
        const today = new Date();
        const history = [];

        for (let i = 0; i < 12; i++) {
            const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const { summary } = await this.getExpenses(cardId, d.getMonth() + 1, d.getFullYear());
            history.push(summary);
        }

        return history;
    }
};
