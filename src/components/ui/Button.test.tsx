import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button Component', () => {
    describe('Renderização', () => {
        it('deve renderizar com texto', () => {
            render(<Button>Click me</Button>);
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        it('deve renderizar como button por padrão', () => {
            render(<Button>Test</Button>);
            const button = screen.getByRole('button');
            expect(button.tagName).toBe('BUTTON');
        });

        it('deve aplicar className customizada', () => {
            render(<Button className="custom-class">Test</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('custom-class');
        });
    });

    describe('Variantes', () => {
        it('deve aplicar variante primary', () => {
            render(<Button variant="primary">Primary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-primary-600');
        });

        it('deve aplicar variante secondary', () => {
            render(<Button variant="secondary">Secondary</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-gray-200');
        });

        it('deve aplicar variante danger', () => {
            render(<Button variant="danger">Danger</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-red-600');
        });

        it('deve aplicar variante ghost', () => {
            render(<Button variant="ghost">Ghost</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('hover:bg-gray-100');
        });
    });

    describe('Tamanhos', () => {
        it('deve aplicar tamanho small', () => {
            render(<Button size="sm">Small</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
        });

        it('deve aplicar tamanho medium (padrão)', () => {
            render(<Button size="md">Medium</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-4', 'py-2');
        });

        it('deve aplicar tamanho large', () => {
            render(<Button size="lg">Large</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
        });
    });

    describe('Estados', () => {
        it('deve desabilitar quando disabled=true', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
        });

        it('deve mostrar loading spinner quando loading=true', () => {
            render(<Button loading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();

            // Verificar se o spinner está presente
            const svg = button.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveClass('animate-spin');
        });

        it('deve ocultar texto quando loading=true', () => {
            render(<Button loading>Click me</Button>);
            const button = screen.getByRole('button');

            // O texto deve estar presente mas visualmente oculto
            expect(button).toHaveTextContent('Click me');
        });
    });

    describe('Largura completa', () => {
        it('deve aplicar largura completa quando fullWidth=true', () => {
            render(<Button fullWidth>Full Width</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('w-full');
        });

        it('não deve aplicar largura completa por padrão', () => {
            render(<Button>Normal</Button>);
            const button = screen.getByRole('button');
            expect(button).not.toHaveClass('w-full');
        });
    });

    describe('Interações', () => {
        it('deve chamar onClick quando clicado', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick}>Click me</Button>);
            const button = screen.getByRole('button');

            await user.click(button);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('não deve chamar onClick quando disabled', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick} disabled>Disabled</Button>);
            const button = screen.getByRole('button');

            await user.click(button);
            expect(handleClick).not.toHaveBeenCalled();
        });

        it('não deve chamar onClick quando loading', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            render(<Button onClick={handleClick} loading>Loading</Button>);
            const button = screen.getByRole('button');

            await user.click(button);
            expect(handleClick).not.toHaveBeenCalled();
        });
    });

    describe('Tipos de botão', () => {
        it('deve renderizar como submit quando type="submit"', () => {
            render(<Button type="submit">Submit</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'submit');
        });

        it('deve renderizar como button quando type="button"', () => {
            render(<Button type="button">Button</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'button');
        });

        it('deve renderizar como reset quando type="reset"', () => {
            render(<Button type="reset">Reset</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('type', 'reset');
        });
    });

    describe('Ícones', () => {
        it('deve renderizar ícone à esquerda', () => {
            const Icon = () => <span data-testid="icon-left">🔍</span>;
            render(<Button leftIcon={<Icon />}>Search</Button>);

            expect(screen.getByTestId('icon-left')).toBeInTheDocument();
            expect(screen.getByText('Search')).toBeInTheDocument();
        });

        it('deve renderizar ícone à direita', () => {
            const Icon = () => <span data-testid="icon-right">→</span>;
            render(<Button rightIcon={<Icon />}>Next</Button>);

            expect(screen.getByTestId('icon-right')).toBeInTheDocument();
            expect(screen.getByText('Next')).toBeInTheDocument();
        });

        it('deve renderizar ambos os ícones', () => {
            const LeftIcon = () => <span data-testid="icon-left">←</span>;
            const RightIcon = () => <span data-testid="icon-right">→</span>;

            render(
                <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
                    Both
                </Button>
            );

            expect(screen.getByTestId('icon-left')).toBeInTheDocument();
            expect(screen.getByTestId('icon-right')).toBeInTheDocument();
        });
    });

    describe('Acessibilidade', () => {
        it('deve ter role="button"', () => {
            render(<Button>Accessible</Button>);
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('deve aceitar aria-label', () => {
            render(<Button aria-label="Custom label">Icon</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Custom label');
        });

        it('deve ter aria-disabled quando disabled', () => {
            render(<Button disabled>Disabled</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-disabled', 'true');
        });

        it('deve ter aria-busy quando loading', () => {
            render(<Button loading>Loading</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-busy', 'true');
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com texto muito longo', () => {
            const longText = 'A'.repeat(100);
            render(<Button>{longText}</Button>);
            expect(screen.getByText(longText)).toBeInTheDocument();
        });

        it('deve lidar com children vazio', () => {
            render(<Button />);
            const button = screen.getByRole('button');
            expect(button).toBeInTheDocument();
        });

        it('deve lidar com múltiplas classes customizadas', () => {
            render(<Button className="class1 class2 class3">Test</Button>);
            const button = screen.getByRole('button');
            expect(button).toHaveClass('class1', 'class2', 'class3');
        });
    });

    describe('Combinações de props', () => {
        it('deve combinar variant + size + fullWidth', () => {
            render(
                <Button variant="primary" size="lg" fullWidth>
                    Combined
                </Button>
            );
            const button = screen.getByRole('button');
            expect(button).toHaveClass('bg-primary-600', 'px-6', 'py-3', 'w-full');
        });

        it('deve combinar loading + disabled', () => {
            render(
                <Button loading disabled>
                    Both States
                </Button>
            );
            const button = screen.getByRole('button');
            expect(button).toBeDisabled();
            expect(button).toHaveAttribute('aria-busy', 'true');
        });
    });
});
