import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
    describe('Renderização', () => {
        it('deve renderizar com children', () => {
            render(<Card>Card content</Card>);
            expect(screen.getByText('Card content')).toBeInTheDocument();
        });

        it('deve renderizar como div por padrão', () => {
            const { container } = render(<Card>Test</Card>);
            const card = container.firstChild;
            expect(card?.nodeName).toBe('DIV');
        });

        it('deve aplicar className customizada', () => {
            const { container } = render(<Card className="custom-class">Test</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('custom-class');
        });
    });

    describe('Variantes', () => {
        it('deve aplicar variante default', () => {
            const { container } = render(<Card variant="default">Default</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('bg-white', 'dark:bg-gray-800');
        });

        it('deve aplicar variante outlined', () => {
            const { container } = render(<Card variant="outlined">Outlined</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('border-2');
        });

        it('deve aplicar variante elevated', () => {
            const { container } = render(<Card variant="elevated">Elevated</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('shadow-lg');
        });
    });

    describe('Padding', () => {
        it('deve aplicar padding none', () => {
            const { container } = render(<Card padding="none">No padding</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('p-0');
        });

        it('deve aplicar padding small', () => {
            const { container } = render(<Card padding="sm">Small</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('p-3');
        });

        it('deve aplicar padding medium (padrão)', () => {
            const { container } = render(<Card padding="md">Medium</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('p-4');
        });

        it('deve aplicar padding large', () => {
            const { container } = render(<Card padding="lg">Large</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('p-6');
        });
    });

    describe('Hover', () => {
        it('deve aplicar efeito hover quando hoverable=true', () => {
            const { container } = render(<Card hoverable>Hoverable</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('hover:shadow-md', 'transition-shadow');
        });

        it('não deve aplicar efeito hover por padrão', () => {
            const { container } = render(<Card>Normal</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).not.toHaveClass('hover:shadow-md');
        });
    });

    describe('Clickable', () => {
        it('deve aplicar cursor pointer quando clickable=true', () => {
            const { container } = render(<Card clickable>Clickable</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('cursor-pointer');
        });

        it('não deve aplicar cursor pointer por padrão', () => {
            const { container } = render(<Card>Normal</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).not.toHaveClass('cursor-pointer');
        });
    });

    describe('Header e Footer', () => {
        it('deve renderizar header', () => {
            render(
                <Card header={<div>Card Header</div>}>
                    Content
                </Card>
            );
            expect(screen.getByText('Card Header')).toBeInTheDocument();
        });

        it('deve renderizar footer', () => {
            render(
                <Card footer={<div>Card Footer</div>}>
                    Content
                </Card>
            );
            expect(screen.getByText('Card Footer')).toBeInTheDocument();
        });

        it('deve renderizar header e footer juntos', () => {
            render(
                <Card
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                >
                    Content
                </Card>
            );
            expect(screen.getByText('Header')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
    });

    describe('Título e Descrição', () => {
        it('deve renderizar título', () => {
            render(<Card title="Card Title">Content</Card>);
            expect(screen.getByText('Card Title')).toBeInTheDocument();
        });

        it('deve renderizar descrição', () => {
            render(<Card description="Card description">Content</Card>);
            expect(screen.getByText('Card description')).toBeInTheDocument();
        });

        it('deve renderizar título e descrição juntos', () => {
            render(
                <Card title="Title" description="Description">
                    Content
                </Card>
            );
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Description')).toBeInTheDocument();
        });
    });

    describe('Loading', () => {
        it('deve mostrar skeleton quando loading=true', () => {
            const { container } = render(<Card loading>Content</Card>);
            const skeleton = container.querySelector('.animate-pulse');
            expect(skeleton).toBeInTheDocument();
        });

        it('deve ocultar conteúdo quando loading=true', () => {
            render(<Card loading>Hidden content</Card>);
            expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
        });

        it('deve mostrar conteúdo quando loading=false', () => {
            render(<Card loading={false}>Visible content</Card>);
            expect(screen.getByText('Visible content')).toBeInTheDocument();
        });
    });

    describe('Bordas arredondadas', () => {
        it('deve aplicar bordas arredondadas por padrão', () => {
            const { container } = render(<Card>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('rounded-lg');
        });

        it('deve permitir desabilitar bordas arredondadas', () => {
            const { container } = render(<Card rounded={false}>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).not.toHaveClass('rounded-lg');
        });
    });

    describe('Largura completa', () => {
        it('deve aplicar largura completa quando fullWidth=true', () => {
            const { container } = render(<Card fullWidth>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('w-full');
        });

        it('não deve aplicar largura completa por padrão', () => {
            const { container } = render(<Card>Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).not.toHaveClass('w-full');
        });
    });

    describe('Interações', () => {
        it('deve chamar onClick quando clicado', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                <Card onClick={handleClick} clickable>
                    Click me
                </Card>
            );
            const card = container.firstChild as HTMLElement;

            await user.click(card);
            expect(handleClick).toHaveBeenCalledTimes(1);
        });

        it('deve ter role="button" quando clickable', () => {
            const { container } = render(<Card clickable>Clickable</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('role', 'button');
        });

        it('deve ser focável quando clickable', () => {
            const { container } = render(<Card clickable>Clickable</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('tabIndex', '0');
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com conteúdo vazio', () => {
            const { container } = render(<Card />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it('deve lidar com múltiplos children', () => {
            render(
                <Card>
                    <div>Child 1</div>
                    <div>Child 2</div>
                    <div>Child 3</div>
                </Card>
            );
            expect(screen.getByText('Child 1')).toBeInTheDocument();
            expect(screen.getByText('Child 2')).toBeInTheDocument();
            expect(screen.getByText('Child 3')).toBeInTheDocument();
        });

        it('deve lidar com conteúdo muito longo', () => {
            const longContent = 'A'.repeat(1000);
            render(<Card>{longContent}</Card>);
            expect(screen.getByText(longContent)).toBeInTheDocument();
        });
    });

    describe('Combinações de props', () => {
        it('deve combinar variant + padding + hoverable', () => {
            const { container } = render(
                <Card variant="elevated" padding="lg" hoverable>
                    Combined
                </Card>
            );
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('shadow-lg', 'p-6', 'hover:shadow-md');
        });

        it('deve combinar clickable + hoverable', () => {
            const { container } = render(
                <Card clickable hoverable>
                    Interactive
                </Card>
            );
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveClass('cursor-pointer', 'hover:shadow-md');
            expect(card).toHaveAttribute('role', 'button');
        });

        it('deve combinar header + footer + title', () => {
            render(
                <Card
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    title="Title"
                >
                    Content
                </Card>
            );
            expect(screen.getByText('Header')).toBeInTheDocument();
            expect(screen.getByText('Title')).toBeInTheDocument();
            expect(screen.getByText('Content')).toBeInTheDocument();
            expect(screen.getByText('Footer')).toBeInTheDocument();
        });
    });

    describe('Acessibilidade', () => {
        it('deve aceitar aria-label', () => {
            const { container } = render(<Card aria-label="Product card">Content</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('aria-label', 'Product card');
        });

        it('deve ter tabIndex quando clickable', () => {
            const { container } = render(<Card clickable>Clickable</Card>);
            const card = container.firstChild as HTMLElement;
            expect(card).toHaveAttribute('tabIndex', '0');
        });

        it('deve responder a Enter quando clickable', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();

            const { container } = render(
                <Card onClick={handleClick} clickable>
                    Press Enter
                </Card>
            );
            const card = container.firstChild as HTMLElement;

            card.focus();
            await user.keyboard('{Enter}');
            expect(handleClick).toHaveBeenCalled();
        });
    });
});
