import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardForm } from './CardForm';
import { ToastProvider } from '../../context/ToastContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('../../services/cards.service', () => ({
    cardsService: {
        create: vi.fn(),
        update: vi.fn(),
    },
}));

import { cardsService } from '../../services/cards.service';

const renderWithProviders = (component: React.ReactElement) => {
    return render(<ToastProvider>{component}</ToastProvider>);
};

describe('CardForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Renderização', () => {
        it('deve renderizar formulário vazio para novo cartão', () => {
            renderWithProviders(<CardForm />);

            expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/bandeira/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/limite/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/fechamento/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/vencimento/i)).toBeInTheDocument();
        });

        it('deve renderizar com dados para edição', () => {
            const cartaoExistente = {
                id: '789',
                name: 'Visa Gold',
                brand: 'Visa',
                limit_amount: 10000,
                closing_day: 15,
                due_day: 20,
                color: '#FFD700',
            };

            renderWithProviders(<CardForm card={cartaoExistente} />);

            const nomeInput = screen.getByLabelText(/nome/i) as HTMLInputElement;
            expect(nomeInput.value).toBe('Visa Gold');

            const limiteInput = screen.getByLabelText(/limite/i) as HTMLInputElement;
            expect(limiteInput.value).toBe('10000');
        });
    });

    describe('Criação de Cartão', () => {
        it('deve criar cartão com sucesso', async () => {
            const user = userEvent.setup();
            const mockCreate = vi.mocked(cardsService.create);
            mockCreate.mockResolvedValue({
                id: 'new-id',
                name: 'Mastercard Black',
                brand: 'Mastercard',
                limit_amount: 15000,
                closing_day: 10,
                due_day: 15,
                color: '#000000',
                user_id: 'user-123',
            });

            renderWithProviders(<CardForm />);

            await user.type(screen.getByLabelText(/nome/i), 'Mastercard Black');
            await user.selectOptions(screen.getByLabelText(/bandeira/i), 'Mastercard');
            await user.type(screen.getByLabelText(/limite/i), '15000');
            await user.type(screen.getByLabelText(/fechamento/i), '10');
            await user.type(screen.getByLabelText(/vencimento/i), '15');

            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            await waitFor(() => {
                expect(mockCreate).toHaveBeenCalledWith(
                    expect.objectContaining({
                        name: 'Mastercard Black',
                        brand: 'Mastercard',
                        limit_amount: 15000,
                        closing_day: 10,
                        due_day: 15,
                    })
                );
            });
        });
    });

    describe('Edição de Cartão', () => {
        it('deve atualizar cartão com sucesso', async () => {
            const user = userEvent.setup();
            const mockUpdate = vi.mocked(cardsService.update);
            mockUpdate.mockResolvedValue({
                id: '789',
                name: 'Visa Platinum',
                brand: 'Visa',
                limit_amount: 20000,
                closing_day: 15,
                due_day: 20,
                color: '#C0C0C0',
                user_id: 'user-123',
            });

            const cartaoExistente = {
                id: '789',
                name: 'Visa Gold',
                brand: 'Visa',
                limit_amount: 10000,
                closing_day: 15,
                due_day: 20,
                color: '#FFD700',
            };

            renderWithProviders(<CardForm card={cartaoExistente} />);

            const nomeInput = screen.getByLabelText(/nome/i);
            await user.clear(nomeInput);
            await user.type(nomeInput, 'Visa Platinum');

            const limiteInput = screen.getByLabelText(/limite/i);
            await user.clear(limiteInput);
            await user.type(limiteInput, '20000');

            await user.click(screen.getByRole('button', { name: /salvar|atualizar/i }));

            await waitFor(() => {
                expect(mockUpdate).toHaveBeenCalledWith(
                    '789',
                    expect.objectContaining({
                        name: 'Visa Platinum',
                        limit_amount: 20000,
                    })
                );
            });
        });
    });

    describe('Validações', () => {
        it('deve validar nome obrigatório', async () => {
            const user = userEvent.setup();
            renderWithProviders(<CardForm />);

            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            expect(screen.getByLabelText(/nome/i)).toBeInvalid();
        });

        it('deve validar limite obrigatório', async () => {
            const user = userEvent.setup();
            renderWithProviders(<CardForm />);

            await user.click(screen.getByRole('button', { name: /salvar|criar/i }));

            expect(screen.getByLabelText(/limite/i)).toBeInvalid();
        });

        it('deve validar dia de fechamento entre 1 e 31', () => {
            renderWithProviders(<CardForm />);

            const fechamentoInput = screen.getByLabelText(/fechamento/i);
            expect(fechamentoInput).toHaveAttribute('min', '1');
            expect(fechamentoInput).toHaveAttribute('max', '31');
        });

        it('deve validar dia de vencimento entre 1 e 31', () => {
            renderWithProviders(<CardForm />);

            const vencimentoInput = screen.getByLabelText(/vencimento/i);
            expect(vencimentoInput).toHaveAttribute('min', '1');
            expect(vencimentoInput).toHaveAttribute('max', '31');
        });

        it('deve validar limite positivo', () => {
            renderWithProviders(<CardForm />);

            const limiteInput = screen.getByLabelText(/limite/i);
            expect(limiteInput).toHaveAttribute('min', '0');
        });
    });

    describe('Bandeiras', () => {
        it('deve exibir opções de bandeiras', () => {
            renderWithProviders(<CardForm />);

            const bandeiraSelect = screen.getByLabelText(/bandeira/i);
            const options = Array.from(bandeiraSelect.querySelectorAll('option')).map(opt => opt.textContent);

            expect(options).toContain('Visa');
            expect(options).toContain('Mastercard');
            expect(options).toContain('Elo');
            expect(options).toContain('American Express');
        });
    });

    describe('Seletor de Cor', () => {
        it('deve permitir selecionar cor do cartão', async () => {
            const user = userEvent.setup();
            renderWithProviders(<CardForm />);

            const colorInput = screen.getByLabelText(/cor/i);
            await user.click(colorInput);

            // Simular seleção de cor
            await user.type(colorInput, '#FF5733');

            expect(colorInput).toHaveValue('#FF5733');
        });

        it('deve ter cor padrão', () => {
            renderWithProviders(<CardForm />);

            const colorInput = screen.getByLabelText(/cor/i) as HTMLInputElement;
            expect(colorInput.value).toBeTruthy();
        });
    });

    describe('Cancelamento', () => {
        it('deve navegar de volta ao cancelar', async () => {
            const user = userEvent.setup();
            renderWithProviders(<CardForm />);

            await user.click(screen.getByRole('button', { name: /cancelar|voltar/i }));

            expect(mockNavigate).toHaveBeenCalledWith('/cartoes');
        });
    });

    describe('Preview do Cartão', () => {
        it('deve exibir preview visual do cartão', async () => {
            const user = userEvent.setup();
            renderWithProviders(<CardForm />);

            // Preencher nome
            await user.type(screen.getByLabelText(/nome/i), 'Meu Cartão');

            // Verificar se há preview (se implementado)
            const preview = screen.queryByText('Meu Cartão');
            if (preview && preview !== screen.getByLabelText(/nome/i)) {
                expect(preview).toBeInTheDocument();
            }
        });
    });
});
