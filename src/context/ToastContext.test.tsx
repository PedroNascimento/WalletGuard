import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';
import React from 'react';

describe('ToastContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('Inicialização', () => {
        it('deve inicializar sem toasts', () => {
            const { result } = renderHook(() => useToast(), {
                wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
            });

            // O contexto deve estar disponível
            expect(result.current.addToast).toBeDefined();
            expect(result.current.removeToast).toBeDefined();
        });

        it('deve lançar erro quando usado fora do Provider', () => {
            // Suprimir console.error para este teste
            const originalError = console.error;
            console.error = vi.fn();

            expect(() => {
                renderHook(() => useToast());
            }).toThrow('useToast must be used within a ToastProvider');

            console.error = originalError;
        });
    });

    describe('addToast()', () => {
        it('deve adicionar toast de sucesso', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="success" message="Operação realizada com sucesso" />
                </ToastProvider>
            );

            expect(screen.getByText('Operação realizada com sucesso')).toBeInTheDocument();
            expect(container.querySelector('.bg-green-600')).toBeInTheDocument();
        });

        it('deve adicionar toast de erro', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="error" message="Erro ao processar" />
                </ToastProvider>
            );

            expect(screen.getByText('Erro ao processar')).toBeInTheDocument();
            expect(container.querySelector('.bg-red-600')).toBeInTheDocument();
        });

        it('deve adicionar toast de info', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="info" message="Informação importante" />
                </ToastProvider>
            );

            expect(screen.getByText('Informação importante')).toBeInTheDocument();
            expect(container.querySelector('.bg-blue-600')).toBeInTheDocument();
        });

        it('deve adicionar múltiplos toasts', () => {
            render(
                <ToastProvider>
                    <MultipleToastsComponent />
                </ToastProvider>
            );

            expect(screen.getByText('Toast 1')).toBeInTheDocument();
            expect(screen.getByText('Toast 2')).toBeInTheDocument();
            expect(screen.getByText('Toast 3')).toBeInTheDocument();
        });
    });

    describe('removeToast()', () => {
        it('deve remover toast manualmente', async () => {
            render(
                <ToastProvider>
                    <RemovableToastComponent />
                </ToastProvider>
            );

            expect(screen.getByText('Toast removível')).toBeInTheDocument();

            const closeButton = screen.getByRole('button');
            act(() => {
                closeButton.click();
            });

            await waitFor(() => {
                expect(screen.queryByText('Toast removível')).not.toBeInTheDocument();
            });
        });
    });

    describe('Auto-remoção', () => {
        it('deve remover toast automaticamente após 3 segundos', async () => {
            render(
                <ToastProvider>
                    <TestComponent type="success" message="Auto-remove" />
                </ToastProvider>
            );

            expect(screen.getByText('Auto-remove')).toBeInTheDocument();

            // Avançar 3 segundos
            act(() => {
                vi.advanceTimersByTime(3000);
            });

            await waitFor(() => {
                expect(screen.queryByText('Auto-remove')).not.toBeInTheDocument();
            });
        });

        it('deve remover múltiplos toasts após 3 segundos cada', async () => {
            render(
                <ToastProvider>
                    <MultipleToastsComponent />
                </ToastProvider>
            );

            expect(screen.getByText('Toast 1')).toBeInTheDocument();
            expect(screen.getByText('Toast 2')).toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(3000);
            });

            await waitFor(() => {
                expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
                expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
            });
        });
    });

    describe('Ícones', () => {
        it('deve exibir ícone de sucesso', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="success" message="Sucesso" />
                </ToastProvider>
            );

            // Verificar se o ícone CheckCircle está presente (Lucide React)
            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('deve exibir ícone de erro', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="error" message="Erro" />
                </ToastProvider>
            );

            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });

        it('deve exibir ícone de info', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="info" message="Info" />
                </ToastProvider>
            );

            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
        });
    });

    describe('Posicionamento', () => {
        it('deve posicionar toasts no canto superior direito', () => {
            const { container } = render(
                <ToastProvider>
                    <TestComponent type="success" message="Teste" />
                </ToastProvider>
            );

            const toastContainer = container.querySelector('.fixed.top-4.right-4');
            expect(toastContainer).toBeInTheDocument();
        });

        it('deve empilhar toasts verticalmente', () => {
            const { container } = render(
                <ToastProvider>
                    <MultipleToastsComponent />
                </ToastProvider>
            );

            const toastContainer = container.querySelector('.flex.flex-col.gap-2');
            expect(toastContainer).toBeInTheDocument();
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com mensagens muito longas', () => {
            const longMessage = 'A'.repeat(200);

            render(
                <ToastProvider>
                    <TestComponent type="success" message={longMessage} />
                </ToastProvider>
            );

            expect(screen.getByText(longMessage)).toBeInTheDocument();
        });

        it('deve lidar com caracteres especiais', () => {
            const specialMessage = '<script>alert("XSS")</script>';

            render(
                <ToastProvider>
                    <TestComponent type="success" message={specialMessage} />
                </ToastProvider>
            );

            // Deve renderizar como texto, não como HTML
            expect(screen.getByText(specialMessage)).toBeInTheDocument();
        });

        it('deve gerar IDs únicos para cada toast', () => {
            const { result } = renderHook(() => useToast(), {
                wrapper: ({ children }) => <ToastProvider>{children}</ToastProvider>,
            });

            const ids = new Set();

            act(() => {
                for (let i = 0; i < 10; i++) {
                    result.current.addToast(`Toast ${i}`, 'success');
                }
            });

            // Verificar que não há IDs duplicados
            // (isso seria verificado internamente, mas podemos testar indiretamente)
            expect(screen.getAllByRole('button')).toHaveLength(10);
        });
    });
});

// Componentes auxiliares para testes
function TestComponent({ type, message }: { type: 'success' | 'error' | 'info'; message: string }) {
    const { addToast } = useToast();

    React.useEffect(() => {
        addToast(message, type);
    }, []);

    return null;
}

function MultipleToastsComponent() {
    const { addToast } = useToast();

    React.useEffect(() => {
        addToast('Toast 1', 'success');
        addToast('Toast 2', 'error');
        addToast('Toast 3', 'info');
    }, []);

    return null;
}

function RemovableToastComponent() {
    const { addToast, removeToast } = useToast();
    const [toastId, setToastId] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Precisamos capturar o ID do toast para removê-lo
        // Como o ID é gerado internamente, vamos simular clicando no botão X
        addToast('Toast removível', 'success');
    }, []);

    return null;
}
