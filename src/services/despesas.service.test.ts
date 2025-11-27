import { describe, it, expect, beforeEach, vi } from 'vitest';
import { despesasService } from './despesas.service';

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

describe('Despesas Service - CRUD Operations', () => {
    const mockUserId = 'test-user-123';

    beforeEach(() => {
        vi.clearAllMocks();

        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
    });

    describe('list()', () => {
        it('deve listar despesas com paginação padrão', async () => {
            const mockDespesas = [
                { id: '1', description: 'Aluguel', value: 1000, date: '2025-01-05', category: 'Moradia' },
                { id: '2', description: 'Mercado', value: 500, date: '2025-01-10', category: 'Alimentação' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: mockDespesas, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.list({});

            expect(mockSupabase.from).toHaveBeenCalledWith('expenses');
            expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId);
            expect(result).toEqual(mockDespesas);
        });

        it('deve aplicar filtro de tipo', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn((field: string) => {
                    if (field === 'user_id' || field === 'type') return mockChain;
                    return mockChain;
                }),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await despesasService.list({ tipo: 'fixa' });

            expect(mockChain.eq).toHaveBeenCalledWith('type', 'fixa');
        });

        it('deve aplicar filtro de categoria', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn((field: string) => {
                    if (field === 'user_id' || field === 'category') return mockChain;
                    return mockChain;
                }),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await despesasService.list({ categoria: 'Moradia' });

            expect(mockChain.eq).toHaveBeenCalledWith('category', 'Moradia');
        });
    });

    describe('create()', () => {
        it('deve criar uma despesa com sucesso', async () => {
            const novaDespesa = {
                description: 'Aluguel',
                value: 1000,
                date: '2025-01-05',
                category: 'Moradia',
                type: 'fixa' as const,
            };

            const mockDespesaCriada = {
                id: 'new-id',
                user_id: mockUserId,
                ...novaDespesa,
            };

            const mockChain = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockDespesaCriada, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.create(novaDespesa);

            expect(mockSupabase.from).toHaveBeenCalledWith('expenses');
            expect(mockChain.insert).toHaveBeenCalledWith([{
                user_id: mockUserId,
                ...novaDespesa,
            }]);
            expect(result).toEqual(mockDespesaCriada);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            const novaDespesa = {
                description: 'Aluguel',
                value: 1000,
                date: '2025-01-05',
                category: 'Moradia',
                type: 'fixa' as const,
            };

            await expect(despesasService.create(novaDespesa)).rejects.toThrow('Usuário não autenticado');
        });
    });

    describe('update()', () => {
        it('deve atualizar uma despesa com sucesso', async () => {
            const despesaId = 'despesa-123';
            const dadosAtualizados = {
                description: 'Aluguel Atualizado',
                value: 1200,
            };

            const mockDespesaAtualizada = {
                id: despesaId,
                user_id: mockUserId,
                ...dadosAtualizados,
                date: '2025-01-05',
                category: 'Moradia',
            };

            const mockChain = {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockDespesaAtualizada, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.update(despesaId, dadosAtualizados);

            expect(mockChain.update).toHaveBeenCalledWith(dadosAtualizados);
            expect(mockChain.eq).toHaveBeenCalledWith('id', despesaId);
            expect(result).toEqual(mockDespesaAtualizada);
        });
    });

    describe('delete()', () => {
        it('deve deletar uma despesa com sucesso', async () => {
            const despesaId = 'despesa-123';

            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.delete(despesaId);

            expect(mockChain.delete).toHaveBeenCalledWith({ count: 'exact' });
            expect(mockChain.eq).toHaveBeenCalledWith('id', despesaId);
            expect(result).toBe(true);
        });

        it('deve lançar erro quando despesa não é encontrada', async () => {
            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(despesasService.delete('id-inexistente')).rejects.toThrow('não encontrada');
        });
    });

    describe('getStats()', () => {
        it('deve calcular estatísticas corretamente', async () => {
            const mockDespesas = [
                { value: 1000, date: '2025-01-05', category: 'Moradia' },
                { value: 500, date: '2025-01-10', category: 'Alimentação' },
                { value: 300, date: '2025-01-15', category: 'Transporte' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: mockDespesas, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.getStats('2025-01-01', '2025-01-31');

            expect(result.total).toBe(1800); // 1000 + 500 + 300
            expect(result.count).toBe(3);
            expect(result.average).toBe(600);
        });

        it('deve retornar zeros quando não há despesas', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.getStats('2025-01-01', '2025-01-31');

            expect(result.total).toBe(0);
            expect(result.count).toBe(0);
            expect(result.average).toBe(0);
        });
    });

    describe('getCategoryBreakdown()', () => {
        it('deve agrupar despesas por categoria', async () => {
            const mockDespesas = [
                { value: 1000, category: 'Moradia' },
                { value: 500, category: 'Alimentação' },
                { value: 300, category: 'Moradia' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: mockDespesas, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.getCategoryBreakdown('2025-01-01', '2025-01-31');

            expect(result).toHaveLength(2);

            const moradia = result.find(c => c.category === 'Moradia');
            expect(moradia?.total).toBe(1300); // 1000 + 300
            expect(moradia?.percentage).toBeCloseTo(72.22, 1);

            const alimentacao = result.find(c => c.category === 'Alimentação');
            expect(alimentacao?.total).toBe(500);
            expect(alimentacao?.percentage).toBeCloseTo(27.78, 1);
        });

        it('deve retornar array vazio quando não há despesas', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await despesasService.getCategoryBreakdown('2025-01-01', '2025-01-31');

            expect(result).toEqual([]);
        });
    });
});
