import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReceitaForm } from './ReceitaForm';
import { ToastProvider } from '../../context/ToastContext';

// Mock do router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock dos serviços
vi.mock('../../services/receitas.service', () => ({
    receitasService: {
        create: vi.fn(),
        update: vi.fn(),
    },
}));

import { receitasService } from '../../services/receitas.service';

const renderWithProviders = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
};

describe('ReceitaForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderização', () => {
        it('deve renderizar formulário vazio para nova receita', () => {
            renderWithProviders(<ReceitaForm />);

            expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
        });

        it('deve renderizar com dados para edição', () => {
            const receitaExistente = {
                id: '123',
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            renderWithProviders(<ReceitaForm receita={receitaExistente} />);

            const descricaoInput = screen.getByLabelText(/descrição/i) as HTMLInputElement;
            expect(descricaoInput.value).toBe('Salário');

            const valorInput = screen.getByLabelText(/valor/i) as HTMLInputElement;
            expect(valorInput.value).toBe('5000');
        });

        it('deve exibir título correto para nova receita', () => {
            renderWithProviders(<ReceitaForm />);
            expect(screen.getByText(/nova receita|adicionar receita/i)).toBeInTheDocument();
        });

        it('deve exibir título correto para edição', () => {
            const receita = {
                id: '123',
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            renderWithProviders(<ReceitaForm receita={receita} />);
            expect(screen.getByText(/editar receita/i)).toBeInTheDocument();
        });
    });

    describe('Validações', () => {
        it('deve validar descrição obrigatória', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            const descricaoInput = screen.getByLabelText(/descrição/i);
            expect(descricaoInput).toBeInvalid();
        });

        it('deve validar valor obrigatório', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            const valorInput = screen.getByLabelText(/valor/i);
            expect(valorInput).toBeInvalid();
        });

        it('deve validar valor positivo', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const valorInput = screen.getByLabelText(/valor/i);
            await user.clear(valorInput);
            await user.type(valorInput, '-100');

            expect(valorInput).toHaveAttribute('min', '0');
        });

        it('deve validar data obrigatória', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            const dataInput = screen.getByLabelText(/data/i);
            expect(dataInput).toBeInvalid();
        });

        it('deve validar categoria obrigatória', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            const categoriaSelect = screen.getByLabelText(/categoria/i);
            expect(categoriaSelect).toBeInvalid();
        });
    });

    describe('Criação de Receita', () => {
        it('deve criar receita com sucesso', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(receitasService.create);
            mockCreate.mockResolvedValue({
                id: 'new-id',
                description: 'Freelance',
                value: 1500,
                date: '2025-01-20',
                category: 'Freelance',
                type: 'variavel',
                user_id: 'user-123',
            });

            renderWithProviders(<ReceitaForm />);

            // Preencher formulário
            await user.type(screen.getByLabelText(/descrição/i), 'Freelance');
            await user.type(screen.getByLabelText(/valor/i), '1500');
            await user.type(screen.getByLabelText(/data/i), '2025-01-20');

            const categoriaSelect = screen.getByLabelText(/categoria/i);
            await user.selectOptions(categoriaSelect, 'Freelance');

            // Submeter
            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            // Verificar chamada
            await waitFor(() => {
                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        description: 'Freelance',
                        value: 1500,
                        date: '2025-01-20',
                        category: 'Freelance',
                    })
                );
            });

            // Verificar navegação
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/receitas');
            });
        });

        it('deve exibir erro ao falhar criação', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(receitasService.create);
            mockCreate.mockRejectedValue(new Error('Erro ao criar receita'));

            renderWithProviders(<ReceitaForm />);

            // Preencher formulário
            await user.type(screen.getByLabelText(/descrição/i), 'Teste');
            await user.type(screen.getByLabelText(/valor/i), '100');
            await user.type(screen.getByLabelText(/data/i), '2025-01-01');
            await user.selectOptions(screen.getByLabelText(/categoria/i), 'Outros');

            // Submeter
            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            // Verificar toast de erro
            await waitFor(() => {
                expect(screen.getByText(/erro/i)).toBeInTheDocument();
            });
        });
    });

    describe('Edição de Receita', () => {
        it('deve atualizar receita com sucesso', async () => {
            const user = userEvent.setup();
            const mockUpdate = vi.mocked(receitasService.update);
            mockUpdate.mockResolvedValue({
                id: '123',
                description: 'Salário Atualizado',
                value: 6000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa',
                user_id: 'user-123',
            });

            const receitaExistente = {
                id: '123',
                description: 'Salário',
                value: 5000,
                date: '2025-01-15',
                category: 'Salário',
                type: 'fixa' as const,
            };

            renderWithProviders(<ReceitaForm receita={receitaExistente} />);

            // Modificar descrição
            const descricaoInput = screen.getByLabelText(/descrição/i);
            await user.clear(descricaoInput);
            await user.type(descricaoInput, 'Salário Atualizado');

            // Modificar valor
            const valorInput = screen.getByLabelText(/valor/i);
            await user.clear(valorInput);
            await user.type(valorInput, '6000');

            // Submeter
            await user.click(screen.getByRole('button', { name: /salvar|atualizar/i }));

            // Verificar chamada
            await waitFor(() => {
                expect(mockUpdate).toHaveBeenCalledWith(
                    '123',
                    expect.objectContaining({
                        description: 'Salário Atualizado',
                        value: 6000,
                    })
                );
            });
        });
    });

    describe('Campos Opcionais', () => {
        it('deve permitir marcar como recorrente', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const recorrenteCheckbox = screen.getByLabelText(/recorrente/i);
            await user.click(recorrenteCheckbox);

            expect(recorrenteCheckbox).toBeChecked();
        });

        it('deve exibir campo de frequência quando recorrente', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const recorrenteCheckbox = screen.getByLabelText(/recorrente/i);
            await user.click(recorrenteCheckbox);

            await waitFor(() => {
                expect(screen.getByLabelText(/frequência/i)).toBeVisible();
            });
        });

        it('deve permitir adicionar observações', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const observacoesTextarea = screen.getByLabelText(/observações|notas/i);
            await user.type(observacoesTextarea, 'Observação de teste');

            expect(observacoesTextarea).toHaveValue('Observação de teste');
        });
    });

    describe('Tipo de Receita', () => {
        it('deve permitir selecionar tipo fixa', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const tipoSelect = screen.getByLabelText(/tipo/i);
            await user.selectOptions(tipoSelect, 'fixa');

            expect(tipoSelect).toHaveValue('fixa');
        });

        it('deve permitir selecionar tipo variável', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const tipoSelect = screen.getByLabelText(/tipo/i);
            await user.selectOptions(tipoSelect, 'variavel');

            expect(tipoSelect).toHaveValue('variavel');
        });
    });

    describe('Cancelamento', () => {
        it('deve navegar de volta ao cancelar', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const cancelButton = screen.getByRole('button', { name: /cancelar|voltar/i });
            await user.click(cancelButton);

            expect(mockNavigate).toHaveBeenCalledWith('/receitas');
        });

        it('não deve salvar ao cancelar', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(receitasService.create);

            renderWithProviders(<ReceitaForm />);

            // Preencher formulário
            await user.type(screen.getByLabelText(/descrição/i), 'Teste');

            // Cancelar
            await user.click(screen.getByRole('button', { name: /cancelar/i }));

            expect(mockCreate).not.toHaveBeenCalled();
        });
    });

    describe('Loading State', () => {
        it('deve desabilitar botão durante submissão', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(receitasService.create);
            mockCreate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

            renderWithProviders(<ReceitaForm />);

            // Preencher e submeter
            await user.type(screen.getByLabelText(/descrição/i), 'Teste');
            await user.type(screen.getByLabelText(/valor/i), '100');
            await user.type(screen.getByLabelText(/data/i), '2025-01-01');
            await user.selectOptions(screen.getByLabelText(/categoria/i), 'Outros');

            const submitButton = screen.getByRole('button', { name: /salvar|criar/i });
            await user.click(submitButton);

            // Verificar que está desabilitado
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Formatação de Valores', () => {
        it('deve aceitar valores decimais', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const valorInput = screen.getByLabelText(/valor/i);
            await user.type(valorInput, '1500.50');

            expect(valorInput).toHaveValue(1500.50);
        });

        it('deve aceitar valores grandes', async () => {
            const user = userEvent.setup();
            renderWithProviders(<ReceitaForm />);

            const valorInput = screen.getByLabelText(/valor/i);
            await user.type(valorInput, '100000');

            expect(valorInput).toHaveValue(100000);
        });
    });
});
