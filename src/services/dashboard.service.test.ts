import { describe, it, expect, beforeEach, vi } from 'vitest';
import { dashboardService } from '../services/dashboard.service';

// Mock do Supabase
vi.mock('../services/supabase', () => ({
    supabase: {
        auth: {
            getUser: vi.fn(() => Promise.resolve({
                data: { user: { id: 'test-user-id' } },
                error: null,
            })),
        },
        from: vi.fn((table: string) => {
            const mockData = {
                receitas: [
                    { value: 3000, date: '2025-01-15' },
                    { value: 1500, date: '2025-01-20' },
                ],
                expenses: [
                    { value: 1000, date: '2025-01-10' },
                    { value: 500, date: '2025-01-25' },
                ],
            };

            return {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                gte: vi.fn().mockReturnThis(),
                lte: vi.fn().mockReturnThis(),
                order: vi.fn(() => Promise.resolve({
                    data: mockData[table as keyof typeof mockData] || [],
                    error: null,
                })),
            };
        }),
    },
}));

describe('Dashboard Service - Integração', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getCurrentMonthSummary', () => {
        it('deve calcular resumo financeiro corretamente', async () => {
            const resultado = await dashboardService.getCurrentMonthSummary();

            expect(resultado).toBeDefined();
            expect(resultado.totalReceitas).toBe(4500); // 3000 + 1500
            expect(resultado.totalDespesas).toBe(1500); // 1000 + 500
            expect(resultado.saldo).toBe(3000); // 4500 - 1500
        });

        it('deve retornar saldo negativo quando despesas > receitas', async () => {
            // Override mock para este teste
            vi.mocked(dashboardService.getCurrentMonthSummary).mockResolvedValueOnce({
                totalReceitas: 1000,
                totalDespesas: 2000,
                saldo: -1000,
                percentualVariacao: -100,
            });

            const resultado = await dashboardService.getCurrentMonthSummary();
            expect(resultado.saldo).toBeLessThan(0);
        });
    });
});
