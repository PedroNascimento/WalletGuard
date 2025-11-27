import { describe, it, expect, beforeEach, vi } from 'vitest';
import { receitasService } from './receitas.service';

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

describe('Receitas Service - CRUD Operations', () => {
    const mockUserId = 'test-user-123';

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock padrão do getUser
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
    });

    describe('list()', () => {
        it('deve listar receitas com paginação padrão', async () => {
            const mockReceitas = [
                { id: '1', description: 'Salário', value: 5000, date: '2025-01-15', category: 'Salário' },
                { id: '2', description: 'Freelance', value: 1500, date: '2025-01-20', category: 'Freelance' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: mockReceitas, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.list({});

            expect(mockSupabase.from).toHaveBeenCalledWith('receitas');
            expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId);
            expect(result).toEqual(mockReceitas);
        });

        it('deve aplicar filtro de data inicial', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await receitasService.list({ dataInicio: '2025-01-01' });

            expect(mockChain.gte).toHaveBeenCalledWith('date', '2025-01-01');
        });

        it('deve aplicar filtro de data final', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await receitasService.list({ dataFim: '2025-12-31' });

            expect(mockChain.lte).toHaveBeenCalledWith('date', '2025-12-31');
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

            await receitasService.list({ categoria: 'Salário' });

            expect(mockChain.eq).toHaveBeenCalledWith('category', 'Salário');
        });

        it('deve aplicar busca por texto', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await receitasService.list({ search: 'freelance' });

            expect(mockChain.ilike).toHaveBeenCalledWith('description', '%freelance%');
        });

        it('deve lançar erro quando falha', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                ilike: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' }
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(receitasService.list({})).rejects.toThrow();
        });
    });

    describe('create()', () => {
        it('deve criar uma receita com sucesso', async () => {
            const novaReceita = {
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            const mockReceitaCriada = {
                id: 'new-id',
                user_id: mockUserId,
                ...novaReceita,
            };

            const mockChain = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockReceitaCriada, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.create(novaReceita);

            expect(mockSupabase.from).toHaveBeenCalledWith('receitas');
            expect(mockChain.insert).toHaveBeenCalledWith([{
                user_id: mockUserId,
                ...novaReceita,
            }]);
            expect(result).toEqual(mockReceitaCriada);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            const novaReceita = {
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            await expect(receitasService.create(novaReceita)).rejects.toThrow('Usuário não autenticado');
        });

        it('deve lançar erro quando falha ao criar', async () => {
            const mockChain = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Insert failed' }
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const novaReceita = {
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            await expect(receitasService.create(novaReceita)).rejects.toThrow();
        });
    });

    describe('update()', () => {
        it('deve atualizar uma receita com sucesso', async () => {
            const receitaId = 'receita-123';
            const dadosAtualizados = {
                description: 'Salário Atualizado',
                value: 6000,
            };

            const mockReceitaAtualizada = {
                id: receitaId,
                user_id: mockUserId,
                ...dadosAtualizados,
                date: '2025-01-15',
                category: 'Salário',
            };

            const mockChain = {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockReceitaAtualizada, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.update(receitaId, dadosAtualizados);

            expect(mockSupabase.from).toHaveBeenCalledWith('receitas');
            expect(mockChain.update).toHaveBeenCalledWith(dadosAtualizados);
            expect(mockChain.eq).toHaveBeenCalledWith('id', receitaId);
            expect(result).toEqual(mockReceitaAtualizada);
        });

        it('deve lançar erro quando falha ao atualizar', async () => {
            const mockChain = {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Update failed' }
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(receitasService.update('id', {})).rejects.toThrow();
        });
    });

    describe('delete()', () => {
        it('deve deletar uma receita com sucesso', async () => {
            const receitaId = 'receita-123';

            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.delete(receitaId);

            expect(mockSupabase.from).toHaveBeenCalledWith('receitas');
            expect(mockChain.delete).toHaveBeenCalledWith({ count: 'exact' });
            expect(mockChain.eq).toHaveBeenCalledWith('id', receitaId);
            expect(result).toBe(true);
        });

        it('deve lançar erro quando receita não é encontrada', async () => {
            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(receitasService.delete('id-inexistente')).rejects.toThrow('não encontrada');
        });

        it('deve lançar erro quando falha ao deletar', async () => {
            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({
                    error: { message: 'Delete failed' },
                    count: null
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(receitasService.delete('id')).rejects.toThrow();
        });
    });

    describe('getStats()', () => {
        it('deve calcular estatísticas corretamente', async () => {
            const mockReceitas = [
                { value: 5000, date: '2025-01-15' },
                { value: 1500, date: '2025-01-20' },
                { value: 2000, date: '2025-01-25' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: mockReceitas, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.getStats('2025-01-01', '2025-01-31');

            expect(result.total).toBe(8500); // 5000 + 1500 + 2000
            expect(result.count).toBe(3);
            expect(result.average).toBe(2833.33);
        });

        it('deve retornar zeros quando não há receitas', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await receitasService.getStats('2025-01-01', '2025-01-31');

            expect(result.total).toBe(0);
            expect(result.count).toBe(0);
            expect(result.average).toBe(0);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            await expect(receitasService.getStats('2025-01-01', '2025-01-31'))
                .rejects.toThrow('Usuário não autenticado');
        });
    });
});
