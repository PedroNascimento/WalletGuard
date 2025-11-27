import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input Component', () => {
    describe('Renderização', () => {
        it('deve renderizar input de texto', () => {
            render(<Input placeholder="Enter text" />);
            const input = screen.getByPlaceholderText('Enter text');
            expect(input).toBeInTheDocument();
            expect(input.tagName).toBe('INPUT');
        });

        it('deve renderizar com label', () => {
            render(<Input label="Username" />);
            expect(screen.getByText('Username')).toBeInTheDocument();
            expect(screen.getByRole('textbox')).toBeInTheDocument();
        });

        it('deve associar label ao input via htmlFor', () => {
            render(<Input label="Email" id="email-input" />);
            const label = screen.getByText('Email');
            const input = screen.getByRole('textbox');
            expect(label).toHaveAttribute('for', 'email-input');
            expect(input).toHaveAttribute('id', 'email-input');
        });

        it('deve gerar ID automático quando não fornecido', () => {
            render(<Input label="Auto ID" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('id');
            expect(input.id).toBeTruthy();
        });
    });

    describe('Tipos de input', () => {
        it('deve renderizar como text por padrão', () => {
            render(<Input />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'text');
        });

        it('deve renderizar como password', () => {
            render(<Input type="password" />);
            const input = screen.getByPlaceholderText('') as HTMLInputElement;
            expect(input.type).toBe('password');
        });

        it('deve renderizar como email', () => {
            render(<Input type="email" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('type', 'email');
        });

        it('deve renderizar como number', () => {
            render(<Input type="number" />);
            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('type', 'number');
        });

        it('deve renderizar como date', () => {
            render(<Input type="date" />);
            const input = document.querySelector('input[type="date"]');
            expect(input).toBeInTheDocument();
        });
    });

    describe('Estados', () => {
        it('deve mostrar mensagem de erro', () => {
            render(<Input error="Invalid input" />);
            expect(screen.getByText('Invalid input')).toBeInTheDocument();
        });

        it('deve aplicar estilo de erro quando error está presente', () => {
            render(<Input error="Error message" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveClass('border-red-500');
        });

        it('deve desabilitar quando disabled=true', () => {
            render(<Input disabled />);
            const input = screen.getByRole('textbox');
            expect(input).toBeDisabled();
            expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
        });

        it('deve marcar como required', () => {
            render(<Input required />);
            const input = screen.getByRole('textbox');
            expect(input).toBeRequired();
        });

        it('deve mostrar asterisco quando required', () => {
            render(<Input label="Required Field" required />);
            expect(screen.getByText('*')).toBeInTheDocument();
        });
    });

    describe('Largura completa', () => {
        it('deve aplicar largura completa quando fullWidth=true', () => {
            render(<Input fullWidth />);
            const container = screen.getByRole('textbox').parentElement;
            expect(container).toHaveClass('w-full');
        });

        it('não deve aplicar largura completa por padrão', () => {
            render(<Input />);
            const container = screen.getByRole('textbox').parentElement;
            expect(container).not.toHaveClass('w-full');
        });
    });

    describe('Interações', () => {
        it('deve chamar onChange quando valor muda', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            render(<Input onChange={handleChange} />);
            const input = screen.getByRole('textbox');

            await user.type(input, 'test');
            expect(handleChange).toHaveBeenCalled();
        });

        it('deve atualizar valor controlado', async () => {
            const handleChange = vi.fn();
            const user = userEvent.setup();

            const { rerender } = render(
                <Input value="" onChange={handleChange} />
            );
            const input = screen.getByRole('textbox') as HTMLInputElement;

            expect(input.value).toBe('');

            await user.type(input, 'a');

            rerender(<Input value="a" onChange={handleChange} />);
            expect(input.value).toBe('a');
        });

        it('deve chamar onBlur quando perde foco', async () => {
            const handleBlur = vi.fn();
            const user = userEvent.setup();

            render(<Input onBlur={handleBlur} />);
            const input = screen.getByRole('textbox');

            await user.click(input);
            await user.tab();

            expect(handleBlur).toHaveBeenCalledTimes(1);
        });

        it('deve chamar onFocus quando ganha foco', async () => {
            const handleFocus = vi.fn();
            const user = userEvent.setup();

            render(<Input onFocus={handleFocus} />);
            const input = screen.getByRole('textbox');

            await user.click(input);
            expect(handleFocus).toHaveBeenCalledTimes(1);
        });
    });

    describe('Placeholder', () => {
        it('deve exibir placeholder', () => {
            render(<Input placeholder="Enter your name" />);
            const input = screen.getByPlaceholderText('Enter your name');
            expect(input).toBeInTheDocument();
        });

        it('deve ocultar placeholder quando há valor', async () => {
            const user = userEvent.setup();
            render(<Input placeholder="Type here" />);
            const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;

            await user.type(input, 'text');
            expect(input.value).toBe('text');
        });
    });

    describe('Validações HTML5', () => {
        it('deve aceitar pattern', () => {
            render(<Input pattern="[0-9]*" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('pattern', '[0-9]*');
        });

        it('deve aceitar minLength', () => {
            render(<Input minLength={5} />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('minLength', '5');
        });

        it('deve aceitar maxLength', () => {
            render(<Input maxLength={10} />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('maxLength', '10');
        });

        it('deve aceitar min para number', () => {
            render(<Input type="number" min={0} />);
            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('min', '0');
        });

        it('deve aceitar max para number', () => {
            render(<Input type="number" max={100} />);
            const input = screen.getByRole('spinbutton');
            expect(input).toHaveAttribute('max', '100');
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter aria-invalid quando há erro', () => {
            render(<Input error="Error" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-invalid', 'true');
        });

        it('deve ter aria-describedby quando há erro', () => {
            render(<Input error="Error message" id="test-input" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-describedby');
        });

        it('deve aceitar aria-label', () => {
            render(<Input aria-label="Search field" />);
            const input = screen.getByLabelText('Search field');
            expect(input).toBeInTheDocument();
        });

        it('deve ter aria-required quando required', () => {
            render(<Input required />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('aria-required', 'true');
        });
    });

    describe('Ícones', () => {
        it('deve renderizar ícone à esquerda', () => {
            const Icon = () => <span data-testid="left-icon">🔍</span>;
            render(<Input leftIcon={<Icon />} />);
            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        });

        it('deve renderizar ícone à direita', () => {
            const Icon = () => <span data-testid="right-icon">✓</span>;
            render(<Input rightIcon={<Icon />} />);
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });

        it('deve renderizar ambos os ícones', () => {
            const LeftIcon = () => <span data-testid="left-icon">🔍</span>;
            const RightIcon = () => <span data-testid="right-icon">✓</span>;

            render(<Input leftIcon={<LeftIcon />} rightIcon={<RightIcon />} />);

            expect(screen.getByTestId('left-icon')).toBeInTheDocument();
            expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        });
    });

    describe('Helper text', () => {
        it('deve exibir helper text', () => {
            render(<Input helperText="Enter at least 8 characters" />);
            expect(screen.getByText('Enter at least 8 characters')).toBeInTheDocument();
        });

        it('deve priorizar erro sobre helper text', () => {
            render(
                <Input
                    helperText="Helper"
                    error="Error message"
                />
            );

            expect(screen.getByText('Error message')).toBeInTheDocument();
            expect(screen.queryByText('Helper')).not.toBeInTheDocument();
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com valor muito longo', async () => {
            const longValue = 'A'.repeat(1000);
            const user = userEvent.setup();

            render(<Input />);
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await user.type(input, longValue);
            expect(input.value).toBe(longValue);
        });

        it('deve lidar com caracteres especiais', async () => {
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            const user = userEvent.setup();

            render(<Input />);
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await user.type(input, specialChars);
            expect(input.value).toBe(specialChars);
        });

        it('deve lidar com emojis', async () => {
            const emojis = '😀😃😄😁';
            const user = userEvent.setup();

            render(<Input />);
            const input = screen.getByRole('textbox') as HTMLInputElement;

            await user.type(input, emojis);
            expect(input.value).toBe(emojis);
        });
    });

    describe('Autocompletar', () => {
        it('deve aceitar autocomplete', () => {
            render(<Input autoComplete="email" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('autocomplete', 'email');
        });

        it('deve desabilitar autocomplete', () => {
            render(<Input autoComplete="off" />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveAttribute('autocomplete', 'off');
        });
    });

    describe('Autofocus', () => {
        it('deve focar automaticamente quando autoFocus=true', () => {
            render(<Input autoFocus />);
            const input = screen.getByRole('textbox');
            expect(input).toHaveFocus();
        });
    });
});
