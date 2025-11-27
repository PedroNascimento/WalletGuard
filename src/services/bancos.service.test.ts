import { describe, it, expect, beforeEach, vi } from 'vitest';
import { bancosService } from './bancos.service';

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

describe('Bancos Service - CRUD Operations', () => {
    const mockUserId = 'test-user-123';

    beforeEach(() => {
        vi.clearAllMocks();

        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: mockUserId } },
            error: null,
        });
    });

    describe('list()', () => {
        it('deve listar bancos do usuário', async () => {
            const mockBancos = [
                { id: '1', name: 'Nubank', type: 'corrente', balance: 5000, color: '#8A05BE' },
                { id: '2', name: 'Inter', type: 'poupanca', balance: 10000, color: '#FF7A00' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({ data: mockBancos, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.list();

            expect(mockSupabase.from).toHaveBeenCalledWith('bank_accounts');
            expect(mockChain.eq).toHaveBeenCalledWith('user_id', mockUserId);
            expect(result).toEqual(mockBancos);
        });

        it('deve lançar erro quando falha', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                order: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Database error' }
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(bancosService.list()).rejects.toThrow();
        });
    });

    describe('create()', () => {
        it('deve criar um banco com sucesso', async () => {
            const novoBanco = {
                name: 'Nubank',
                type: 'corrente' as const,
                balance: 5000,
                color: '#8A05BE',
            };

            const mockBancoCriado = {
                id: 'new-id',
                user_id: mockUserId,
                ...novoBanco,
            };

            const mockChain = {
                insert: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockBancoCriado, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.create(novoBanco);

            expect(mockChain.insert).toHaveBeenCalledWith([{
                user_id: mockUserId,
                ...novoBanco,
            }]);
            expect(result).toEqual(mockBancoCriado);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            const novoBanco = {
                name: 'Nubank',
                type: 'corrente' as const,
                balance: 5000,
                color: '#8A05BE',
            };

            await expect(bancosService.create(novoBanco)).rejects.toThrow('Usuário não autenticado');
        });
    });

    describe('update()', () => {
        it('deve atualizar um banco com sucesso', async () => {
            const bancoId = 'banco-123';
            const dadosAtualizados = {
                name: 'Nubank Atualizado',
                balance: 6000,
            };

            const mockBancoAtualizado = {
                id: bancoId,
                user_id: mockUserId,
                ...dadosAtualizados,
                type: 'corrente',
                color: '#8A05BE',
            };

            const mockChain = {
                update: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                select: vi.fn().mockReturnThis(),
                single: vi.fn().mockResolvedValue({ data: mockBancoAtualizado, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.update(bancoId, dadosAtualizados);

            expect(mockChain.update).toHaveBeenCalledWith(dadosAtualizados);
            expect(mockChain.eq).toHaveBeenCalledWith('id', bancoId);
            expect(result).toEqual(mockBancoAtualizado);
        });
    });

    describe('delete()', () => {
        it('deve deletar um banco com sucesso', async () => {
            const bancoId = 'banco-123';

            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 1 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.delete(bancoId);

            expect(mockChain.delete).toHaveBeenCalledWith({ count: 'exact' });
            expect(mockChain.eq).toHaveBeenCalledWith('id', bancoId);
            expect(result).toBe(true);
        });

        it('deve lançar erro quando banco não é encontrado', async () => {
            const mockChain = {
                delete: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ error: null, count: 0 }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            await expect(bancosService.delete('id-inexistente')).rejects.toThrow('não encontrado');
        });
    });

    describe('getStats()', () => {
        it('deve calcular saldo total corretamente', async () => {
            const mockBancos = [
                { balance: 5000 },
                { balance: 10000 },
                { balance: 3000 },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: mockBancos, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.getStats();

            expect(result.totalBalance).toBe(18000); // 5000 + 10000 + 3000
            expect(result.count).toBe(3);
        });

        it('deve retornar zeros quando não há bancos', async () => {
            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.getStats();

            expect(result.totalBalance).toBe(0);
            expect(result.count).toBe(0);
        });

        it('deve lançar erro quando usuário não está autenticado', async () => {
            mockSupabase.auth.getUser.mockResolvedValue({
                data: { user: null },
                error: null,
            });

            await expect(bancosService.getStats()).rejects.toThrow('Usuário não autenticado');
        });
    });

    describe('hasCards()', () => {
        it('deve retornar true quando banco tem cartões associados', async () => {
            const bancoId = 'banco-123';
            const mockCards = [
                { id: 'card-1', bank_id: bancoId },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: mockCards, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.hasCards(bancoId);

            expect(result).toBe(true);
            expect(mockChain.eq).toHaveBeenCalledWith('bank_id', bancoId);
        });

        it('deve retornar false quando banco não tem cartões', async () => {
            const bancoId = 'banco-123';

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.hasCards(bancoId);

            expect(result).toBe(false);
        });

        it('deve retornar false quando há erro na consulta', async () => {
            const bancoId = 'banco-123';

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValue({
                    data: null,
                    error: { message: 'Error' }
                }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.hasCards(bancoId);

            expect(result).toBe(false);
        });
    });

    describe('getByType()', () => {
        it('deve filtrar bancos por tipo', async () => {
            const mockBancos = [
                { id: '1', name: 'Nubank', type: 'corrente' },
                { id: '2', name: 'Inter', type: 'corrente' },
            ];

            const mockChain = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn((field: string) => {
                    if (field === 'user_id' || field === 'type') return mockChain;
                    return mockChain;
                }),
                order: vi.fn().mockResolvedValue({ data: mockBancos, error: null }),
            };

            mockSupabase.from.mockReturnValue(mockChain);

            const result = await bancosService.getByType('corrente');

            expect(mockChain.eq).toHaveBeenCalledWith('type', 'corrente');
            expect(result).toEqual(mockBancos);
        });
    });
});
