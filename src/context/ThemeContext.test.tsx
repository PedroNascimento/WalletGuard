import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';
import React from 'react';

describe('ThemeContext', () => {
    beforeEach(() => {
        // Limpar localStorage antes de cada teste
        localStorage.clear();

        // Mock do matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: query === '(prefers-color-scheme: dark)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Inicialização', () => {
        it('deve inicializar com tema light por padrão', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('light');
        });

        it('deve carregar tema salvo do localStorage', () => {
            localStorage.setItem('theme', 'dark');

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('dark');
        });

        it('deve detectar preferência do sistema quando não há tema salvo', () => {
            window.matchMedia = vi.fn().mockImplementation(query => ({
                matches: query === '(prefers-color-scheme: dark)' ? true : false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }));

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('dark');
        });
    });

    describe('toggleTheme()', () => {
        it('deve alternar de light para dark', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('light');

            act(() => {
                result.current.toggleTheme();
            });

            expect(result.current.theme).toBe('dark');
        });

        it('deve alternar de dark para light', () => {
            localStorage.setItem('theme', 'dark');

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('dark');

            act(() => {
                result.current.toggleTheme();
            });

            expect(result.current.theme).toBe('light');
        });

        it('deve salvar tema no localStorage', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result.current.toggleTheme();
            });

            expect(localStorage.getItem('theme')).toBe('dark');

            act(() => {
                result.current.toggleTheme();
            });

            expect(localStorage.getItem('theme')).toBe('light');
        });
    });

    describe('setTheme()', () => {
        it('deve definir tema como light', () => {
            localStorage.setItem('theme', 'dark');

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result.current.setTheme('light');
            });

            expect(result.current.theme).toBe('light');
            expect(localStorage.getItem('theme')).toBe('light');
        });

        it('deve definir tema como dark', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result.current.setTheme('dark');
            });

            expect(result.current.theme).toBe('dark');
            expect(localStorage.getItem('theme')).toBe('dark');
        });

        it('não deve alterar se tema já está definido', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(result.current.theme).toBe('light');

            act(() => {
                result.current.setTheme('light');
            });

            expect(result.current.theme).toBe('light');
        });
    });

    describe('Aplicação de classe no documento', () => {
        it('deve adicionar classe dark ao document.documentElement', () => {
            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result.current.setTheme('dark');
            });

            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('deve remover classe dark quando tema é light', () => {
            localStorage.setItem('theme', 'dark');

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(document.documentElement.classList.contains('dark')).toBe(true);

            act(() => {
                result.current.setTheme('light');
            });

            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });
    });

    describe('Persistência', () => {
        it('deve manter tema após remontagem do componente', () => {
            const { result, unmount } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result.current.setTheme('dark');
            });

            unmount();

            const { result: newResult } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            expect(newResult.current.theme).toBe('dark');
        });

        it('deve sincronizar entre múltiplas instâncias', () => {
            const { result: result1 } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            const { result: result2 } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            act(() => {
                result1.current.setTheme('dark');
            });

            expect(result2.current.theme).toBe('dark');
        });
    });

    describe('Casos extremos', () => {
        it('deve lidar com valor inválido no localStorage', () => {
            localStorage.setItem('theme', 'invalid-theme');

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            // Deve usar o padrão (light) quando valor é inválido
            expect(result.current.theme).toBe('light');
        });

        it('deve lidar com localStorage indisponível', () => {
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('localStorage not available');
            });

            const { result } = renderHook(() => useTheme(), {
                wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
            });

            // Não deve lançar erro
            expect(() => {
                act(() => {
                    result.current.setTheme('dark');
                });
            }).not.toThrow();

            Storage.prototype.setItem = originalSetItem;
        });
    });
});
