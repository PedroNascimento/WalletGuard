import { describe, it, expect } from 'vitest';

/**
 * Utilitários de cálculos financeiros
 */

export function calcularSomatorioReceitas(receitas: Array<{ value: number }>): number {
    return receitas.reduce((acc, receita) => acc + Number(receita.value), 0);
}

export function calcularSomatorioDespesas(despesas: Array<{ value: number }>): number {
    return despesas.reduce((acc, despesa) => acc + Number(despesa.value), 0);
}

export function calcularSaldo(receitas: number, despesas: number): number {
    return Number((receitas - despesas).toFixed(2));
}

export function calcularParcelaCartao(valorTotal: number, numeroParcelas: number): {
    valorParcela: number;
    ultimaParcela: number;
} {
    const valorParcela = Number((valorTotal / numeroParcelas).toFixed(2));
    const totalDistribuido = valorParcela * numeroParcelas;
    const diferenca = Number((valorTotal - totalDistribuido).toFixed(2));
    const ultimaParcela = Number((valorParcela + diferenca).toFixed(2));

    return {
        valorParcela,
        ultimaParcela,
    };
}

export function calcularLimiteDisponivel(limiteTotal: number, gastoAtual: number): number {
    return Number((limiteTotal - gastoAtual).toFixed(2));
}

export function calcularPercentualGasto(gastoAtual: number, limiteTotal: number): number {
    if (limiteTotal === 0) return 0;
    return Number(((gastoAtual / limiteTotal) * 100).toFixed(2));
}

// ============================================
// TESTES UNITÁRIOS
// ============================================

describe('Cálculos Financeiros', () => {
    describe('calcularSomatorioReceitas', () => {
        it('deve somar corretamente múltiplas receitas', () => {
            const receitas = [
                { value: 1000 },
                { value: 500 },
                { value: 250.50 },
            ];
            expect(calcularSomatorioReceitas(receitas)).toBe(1750.50);
        });

        it('deve retornar 0 para array vazio', () => {
            expect(calcularSomatorioReceitas([])).toBe(0);
        });

        it('deve lidar com valores decimais', () => {
            const receitas = [
                { value: 100.33 },
                { value: 200.67 },
            ];
            expect(calcularSomatorioReceitas(receitas)).toBe(301);
        });

        it('deve lidar com valores grandes', () => {
            const receitas = [
                { value: 10000 },
                { value: 50000 },
                { value: 25000 },
            ];
            expect(calcularSomatorioReceitas(receitas)).toBe(85000);
        });
    });

    describe('calcularSomatorioDespesas', () => {
        it('deve somar corretamente múltiplas despesas', () => {
            const despesas = [
                { value: 500 },
                { value: 300 },
                { value: 150.75 },
            ];
            expect(calcularSomatorioDespesas(despesas)).toBe(950.75);
        });

        it('deve retornar 0 para array vazio', () => {
            expect(calcularSomatorioDespesas([])).toBe(0);
        });

        it('deve lidar com valores decimais', () => {
            const despesas = [
                { value: 99.99 },
                { value: 50.01 },
            ];
            expect(calcularSomatorioDespesas(despesas)).toBe(150);
        });
    });

    describe('calcularSaldo', () => {
        it('deve calcular saldo positivo corretamente', () => {
            expect(calcularSaldo(5000, 3000)).toBe(2000);
        });

        it('deve calcular saldo negativo corretamente', () => {
            expect(calcularSaldo(2000, 3000)).toBe(-1000);
        });

        it('deve calcular saldo zero', () => {
            expect(calcularSaldo(1000, 1000)).toBe(0);
        });

        it('deve arredondar para 2 casas decimais', () => {
            expect(calcularSaldo(1000.555, 500.333)).toBe(500.22);
        });

        it('deve lidar com valores grandes', () => {
            expect(calcularSaldo(100000, 75000)).toBe(25000);
        });
    });

    describe('calcularParcelaCartao', () => {
        it('deve calcular parcelas iguais quando divisão é exata', () => {
            const resultado = calcularParcelaCartao(1000, 10);
            expect(resultado.valorParcela).toBe(100);
            expect(resultado.ultimaParcela).toBe(100);
        });

        it('deve ajustar última parcela quando há diferença', () => {
            const resultado = calcularParcelaCartao(100, 3);
            expect(resultado.valorParcela).toBe(33.33);
            expect(resultado.ultimaParcela).toBe(33.34);
        });

        it('deve calcular corretamente para 1 parcela', () => {
            const resultado = calcularParcelaCartao(500, 1);
            expect(resultado.valorParcela).toBe(500);
            expect(resultado.ultimaParcela).toBe(500);
        });

        it('deve lidar com valores decimais', () => {
            const resultado = calcularParcelaCartao(99.99, 2);
            expect(resultado.valorParcela).toBe(50);
            expect(resultado.ultimaParcela).toBe(49.99);
        });

        it('deve calcular 12 parcelas corretamente', () => {
            const resultado = calcularParcelaCartao(1200, 12);
            expect(resultado.valorParcela).toBe(100);
            expect(resultado.ultimaParcela).toBe(100);
        });

        it('deve garantir que soma das parcelas = valor total', () => {
            const valorTotal = 1234.56;
            const numeroParcelas = 7;
            const resultado = calcularParcelaCartao(valorTotal, numeroParcelas);

            const soma = (resultado.valorParcela * (numeroParcelas - 1)) + resultado.ultimaParcela;
            expect(soma).toBe(valorTotal);
        });
    });

    describe('calcularLimiteDisponivel', () => {
        it('deve calcular limite disponível corretamente', () => {
            expect(calcularLimiteDisponivel(5000, 2000)).toBe(3000);
        });

        it('deve retornar 0 quando limite está esgotado', () => {
            expect(calcularLimiteDisponivel(1000, 1000)).toBe(0);
        });

        it('deve retornar valor negativo quando excede limite', () => {
            expect(calcularLimiteDisponivel(1000, 1500)).toBe(-500);
        });

        it('deve arredondar para 2 casas decimais', () => {
            expect(calcularLimiteDisponivel(1000.50, 300.333)).toBe(700.17);
        });
    });

    describe('calcularPercentualGasto', () => {
        it('deve calcular percentual corretamente', () => {
            expect(calcularPercentualGasto(2500, 5000)).toBe(50);
        });

        it('deve retornar 100 quando gasto = limite', () => {
            expect(calcularPercentualGasto(1000, 1000)).toBe(100);
        });

        it('deve retornar 0 quando não há gastos', () => {
            expect(calcularPercentualGasto(0, 5000)).toBe(0);
        });

        it('deve retornar 0 quando limite é 0', () => {
            expect(calcularPercentualGasto(100, 0)).toBe(0);
        });

        it('deve calcular percentual acima de 100', () => {
            expect(calcularPercentualGasto(1500, 1000)).toBe(150);
        });

        it('deve arredondar para 2 casas decimais', () => {
            expect(calcularPercentualGasto(333.33, 1000)).toBe(33.33);
        });
    });
});
