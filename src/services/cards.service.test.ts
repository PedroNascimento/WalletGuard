import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cardsService } from './cards.service';

// Mock do Supabase
const mockSupabase = {
    auth: {
        getUser: vi.fn(),
    },
    from: vi.fn(),
};

vi.mock('./supabase', () => ({
    supabase: mockSupabase,
}));

describe('Cards Service - CRUD Operations', () => {
    const mockUserId = 'test-user-123';

    beforeEach(() => {
        vi.clearAllMocks();

        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
    });

    describe('list()', () => {
        it('deve listar cartões do usuário', async () => {
            const mockCartoes = [
                { id: '1', name: 'Visa', brand: 'Visa', limit_amount: 5000, closing_day: 10, due_day: 15 },
                { id: '2', name: 'Mastercard', brand: 'Mastercard', limit_amount: 3000, closing_day: 5, due_day: 10 },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: mockCartoes, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await cardsService.list();

            expect(mockSupabase.from).toHaveBeenCalledWith('cards');
            expect(result).toEqual(mockCartoes);
        });
    });

    describe('create()', () => {
        it('deve criar um cartão com sucesso', async () => {
            const novoCartao = {
                name: 'Visa Gold',
                brand: 'Visa',
                limit_amount: 10000,
                closing_day: 15,
                due_day: 20,
                color: '#FFD700',
            };

            const mockCartaoCriado = {
                id: 'new-id',
                user_id: mockUserId,
                ...novoCartao,
            };

            const mockChain = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockCartaoCriado, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await cardsService.create(novoCartao);

            expect(mockChain.insert).toHaveBeenCalledWith([{
                user_id: mockUserId,
                ...novoCartao,
            }]);
            expect(result).toEqual(mockCartaoCriado);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            const novoCartao = {
                name: 'Visa',
                brand: 'Visa',
                limit_amount: 5000,
                closing_day: 10,
                due_day: 15,
                color: '#000000',
            };

            await expect(cardsService.create(novoCartao)).rejects.toThrow('Usuário não autenticado');
        });
    });

    describe('update()', () => {
        it('deve atualizar um cartão com sucesso', async () => {
            const cartaoId = 'card-123';
            const dadosAtualizados = {
                name: 'Visa Platinum',
                limit_amount: 15000,
            };

            const mockCartaoAtualizado = {
                id: cartaoId,
                user_id: mockUserId,
                ...dadosAtualizados,
                brand: 'Visa',
                closing_day: 10,
                due_day: 15,
            };

            const mockChain = {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockCartaoAtualizado, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await cardsService.update(cartaoId, dadosAtualizados);

            expect(mockChain.update).toHaveBeenCalledWith(dadosAtualizados);
            expect(mockChain.eq).toHaveBeenCalledWith('id', cartaoId);
            expect(result).toEqual(mockCartaoAtualizado);
        });
    });

    describe('delete()', () => {
        it('deve deletar um cartão com sucesso', async () => {
            const cartaoId = 'card-123';

            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await cardsService.delete(cartaoId);

            expect(mockChain.delete).toHaveBeenCalledWith({ count: 'exact' });
            expect(mockChain.eq).toHaveBeenCalledWith('id', cartaoId);
            expect(result).toBe(true);
        });

        it('deve lançar erro quando cartão não é encontrado', async () => {
            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(cardsService.delete('id-inexistente')).rejects.toThrow('não encontrado');
        });
    });

    describe('createExpense() - Parcelamento', () => {
        it('deve criar despesa à vista (1 parcela)', async () => {
            const cardId = 'card-123';
            const despesa = {
                description: 'Compra à vista',
                value: 100,
                date: '2025-01-15',
                category: 'Compras',
                installments: 1,
            };

            const mockChain = {
                insert: vi.fn().mockResolvedValue({ error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await cardsService.createExpense(cardId, despesa);

            expect(mockChain.insert).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        user_id: mockUserId,
                        card_id: cardId,
                        description: 'Compra à vista',
                        value: 100,
                        installments: 1,
                        installment_current: 1,
                        original_amount: 100,
                    }),
                ])
            );
        });

        it('deve criar despesa parcelada em 3x', async () => {
            const cardId = 'card-123';
            const despesa = {
                description: 'Compra parcelada',
                value: 300,
                date: '2025-01-15',
                category: 'Compras',
                installments: 3,
            };

            const mockChain = {
                insert: vi.fn().mockResolvedValue({ error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await cardsService.createExpense(cardId, despesa);

            const insertedData = mockChain.insert.mock.calls[0][0];

            expect(insertedData).toHaveLength(3);
            expect(insertedData[0].description).toBe('Compra parcelada (1/3)');
            expect(insertedData[0].value).toBe(100);
            expect(insertedData[0].installment_current).toBe(1);

            expect(insertedData[1].description).toBe('Compra parcelada (2/3)');
            expect(insertedData[1].value).toBe(100);
            expect(insertedData[1].installment_current).toBe(2);

            expect(insertedData[2].description).toBe('Compra parcelada (3/3)');
            expect(insertedData[2].value).toBe(100);
            expect(insertedData[2].installment_current).toBe(3);
        });

        it('deve ajustar última parcela quando há diferença de centavos', async () => {
            const cardId = 'card-123';
            const despesa = {
                description: 'Compra',
                value: 100,
                date: '2025-01-15',
                category: 'Compras',
                installments: 3,
            };

            const mockChain = {
                insert: vi.fn().mockResolvedValue({ error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await cardsService.createExpense(cardId, despesa);

            const insertedData = mockChain.insert.mock.calls[0][0];

            // 100 / 3 = 33.33 por parcela
            expect(insertedData[0].value).toBe(33.33);
            expect(insertedData[1].value).toBe(33.33);
            // Última parcela ajustada: 33.34 (para somar 100)
            expect(insertedData[2].value).toBe(33.34);

            // Verificar que a soma é exata
            const total = insertedData.reduce((sum: number, item: any) => sum + item.value, 0);
            expect(total).toBe(100);
        });

        it('deve criar parcelas em meses subsequentes', async () => {
            const cardId = 'card-123';
            const despesa = {
                description: 'Compra',
                value: 600,
                date: '2025-01-15',
                category: 'Compras',
                installments: 6,
            };

            const mockChain = {
                insert: vi.fn().mockResolvedValue({ error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await cardsService.createExpense(cardId, despesa);

            const insertedData = mockChain.insert.mock.calls[0][0];

            expect(insertedData[0].date).toBe('2025-01-15');
            expect(insertedData[1].date).toBe('2025-02-15');
            expect(insertedData[2].date).toBe('2025-03-15');
            expect(insertedData[3].date).toBe('2025-04-15');
            expect(insertedData[4].date).toBe('2025-05-15');
            expect(insertedData[5].date).toBe('2025-06-15');
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            const despesa = {
                description: 'Compra',
                value: 100,
                date: '2025-01-15',
                category: 'Compras',
                installments: 1,
            };

            await expect(cardsService.createExpense('card-id', despesa))
                .rejects.toThrow('Usuário não autenticado');
        });
    });

    describe('getExpenses() - Cálculo de Fatura', () => {
        it('deve calcular fatura do mês corretamente', async () => {
            const cardId = 'card-123';
            const mockCard = {
                id: cardId,
                closing_day: 10,
                due_day: 15,
            };

            const mockExpenses = [
                { id: '1', value: 100, date: '2025-01-05' },
                { id: '2', value: 200, date: '2025-01-08' },
            ];

            // Mock para getById
            const mockGetByIdChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockCard, error: null }),
            };

            // Mock para getExpenses
            const mockGetExpensesChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: mockExpenses, error: null }),
            };

            mockSupabase.from
                .mockReturnValueOnce(mockGetByIdChain)
                .mockReturnValueOnce(mockGetExpensesChain);

            const result = await cardsService.getExpenses(cardId, 1, 2025);

            expect(result.expenses).toEqual(mockExpenses);
            expect(result.summary.total).toBe(300); // 100 + 200
            expect(result.summary.month).toBe(1);
            expect(result.summary.year).toBe(2025);
        });

        it('deve retornar total zero quando não há despesas', async () => {
            const cardId = 'card-123';
            const mockCard = {
                id: cardId,
                closing_day: 10,
                due_day: 15,
            };

            const mockGetByIdChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockCard, error: null }),
            };

            const mockGetExpensesChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from
                .mockReturnValueOnce(mockGetByIdChain)
                .mockReturnValueOnce(mockGetExpensesChain);

            const result = await cardsService.getExpenses(cardId, 1, 2025);

            expect(result.summary.total).toBe(0);
            expect(result.expenses).toEqual([]);
        });
    });
});
