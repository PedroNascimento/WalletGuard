import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DespesaForm } from './DespesaForm';
import { ToastProvider } from '../../context/ToastContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../services/despesas.service', () => ({
    despesasService: {
        create: vi.fn(),
        update: vi.fn(),
    },
}));

import { despesasService } from '../../services/despesas.service';

const renderWithProviders = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
};

describe('DespesaForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderização', () => {
        it('deve renderizar formulário vazio para nova despesa', () => {
            renderWithProviders(<DespesaForm />);

            expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
        });

        it('deve renderizar com dados para edição', () => {
            const despesaExistente = {
                id: '456',
                description: 'Aluguel',
                value: 1500,
                date: '2025-01-05',
                category: 'Moradia',
                type: 'fixa' as const,
            };

            renderWithProviders(<DespesaForm despesa={despesaExistente} />);

            const descricaoInput = screen.getByLabelText(/descrição/i) as HTMLInputElement;
            expect(descricaoInput.value).toBe('Aluguel');

            const valorInput = screen.getByLabelText(/valor/i) as HTMLInputElement;
            expect(valorInput.value).toBe('1500');
        });
    });

    describe('Criação de Despesa', () => {
        it('deve criar despesa com sucesso', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(despesasService.create);
            mockCreate.mockResolvedValue({
                id: 'new-id',
                description: 'Mercado',
                value: 500,
                date: '2025-01-10',
                category: 'Alimentação',
                type: 'variavel',
                user_id: 'user-123',
            });

            renderWithProviders(<DespesaForm />);

            await user.type(screen.getByLabelText(/descrição/i), 'Mercado');
            await user.type(screen.getByLabelText(/valor/i), '500');
            await user.type(screen.getByLabelText(/data/i), '2025-01-10');
            await user.selectOptions(screen.getByLabelText(/categoria/i), 'Alimentação');

            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            await waitFor(() => {
                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        description: 'Mercado',
                        value: 500,
                        date: '2025-01-10',
                        category: 'Alimentação',
                    })
                );
            });
        });
    });

    describe('Edição de Despesa', () => {
        it('deve atualizar despesa com sucesso', async () => {
            const user = userEvent.setup();
            const mockUpdate = vi.mocked(despesasService.update);
            mockUpdate.mockResolvedValue({
                id: '456',
                description: 'Aluguel Atualizado',
                value: 1600,
                date: '2025-01-05',
                category: 'Moradia',
                type: 'fixa',
                user_id: 'user-123',
            });

            const despesaExistente = {
                id: '456',
                description: 'Aluguel',
                value: 1500,
                date: '2025-01-05',
                category: 'Moradia',
                type: 'fixa' as const,
            };

            renderWithProviders(<DespesaForm despesa={despesaExistente} />);

            const descricaoInput = screen.getByLabelText(/descrição/i);
            await user.clear(descricaoInput);
            await user.type(descricaoInput, 'Aluguel Atualizado');

            const valorInput = screen.getByLabelText(/valor/i);
            await user.clear(valorInput);
            await user.type(valorInput, '1600');

            await user.click(screen.getByRole('button', { name: /salvar|atualizar/i }));

            await waitFor(() => {
                expect(mockUpdate).toHaveBeenCalledWith(
                    '456',
                    expect.objectContaining({
                        description: 'Aluguel Atualizado',
                        value: 1600,
                    })
                );
            });
        });
    });

    describe('Validações', () => {
        it('deve validar campos obrigatórios', async () => {
            const user = userEvent.setup();
            renderWithProviders(<DespesaForm />);

            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            expect(screen.getByLabelText(/descrição/i)).toBeInvalid();
            expect(screen.getByLabelText(/valor/i)).toBeInvalid();
            expect(screen.getByLabelText(/data/i)).toBeInvalid();
        });

        it('deve validar valor positivo', () => {
            renderWithProviders(<DespesaForm />);

            const valorInput = screen.getByLabelText(/valor/i);
            expect(valorInput).toHaveAttribute('min', '0');
        });
    });

    describe('Categorias de Despesa', () => {
        it('deve exibir categorias específicas de despesa', () => {
            renderWithProviders(<DespesaForm />);

            const categoriaSelect = screen.getByLabelText(/categoria/i);
            const options = Array.from(categoriaSelect.querySelectorAll('option')).map(opt => opt.textContent);

            expect(options).toContain('Moradia');
            expect(options).toContain('Alimentação');
            expect(options).toContain('Transporte');
        });
    });

    describe('Tipo de Despesa', () => {
        it('deve permitir selecionar tipo fixa', async () => {
            const user = userEvent.setup();
            renderWithProviders(<DespesaForm />);

            const tipoSelect = screen.getByLabelText(/tipo/i);
            await user.selectOptions(tipoSelect, 'fixa');

            expect(tipoSelect).toHaveValue('fixa');
        });

        it('deve permitir selecionar tipo variável', async () => {
            const user = userEvent.setup();
            renderWithProviders(<DespesaForm />);

            const tipoSelect = screen.getByLabelText(/tipo/i);
            await user.selectOptions(tipoSelect, 'variavel');

            expect(tipoSelect).toHaveValue('variavel');
        });
    });

    describe('Cancelamento', () => {
        it('deve navegar de volta ao cancelar', async () => {
            const user = userEvent.setup();
            renderWithProviders(<DespesaForm />);

            await user.click(screen.getByRole('button', { name: /cancelar|voltar/i }));

            expect(mockNavigate).toHaveBeenCalledWith('/despesas');
        });
    });
});
