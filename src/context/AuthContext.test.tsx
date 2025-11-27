import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import React from 'react';

// Mock do Supabase
const mockSupabase = {
    auth: {
        getSession: vi.fn(),
        getUser: vi.fn(),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        resetPasswordForEmail: vi.fn(),
        updateUser: vi.fn(),
        onAuthStateChange: vi.fn(),
    },
};

vi.mock('../services/supabase', () => ({
    supabase: mockSupabase,
}));

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock padrão para onAuthStateChange
        mockSupabase.auth.onAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });
    });

    describe('Inicialização', () => {
        it('deve inicializar com loading true', () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            expect(result.current.loading).toBe(true);
        });

        it('deve carregar sessão existente', async () => {
            const mockSession = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    user_metadata: { full_name: 'Test User' },
                },
                access_token: 'token-123',
            };

            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toEqual(mockSession.user);
            expect(result.current.session).toEqual(mockSession);
        });

        it('deve definir loading como false quando não há sessão', async () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.session).toBeNull();
        });
    });

    describe('signIn()', () => {
        it('deve fazer login com sucesso', async () => {
            const mockSession = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    user_metadata: { full_name: 'Test User' },
                },
                access_token: 'token-123',
            };

            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: { session: mockSession, user: mockSession.user },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.signIn('test@example.com', 'password123');
            });

            expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123',
            });

            expect(result.current.user).toEqual(mockSession.user);
            expect(result.current.session).toEqual(mockSession);
        });

        it('deve lançar erro quando credenciais inválidas', async () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.signInWithPassword.mockResolvedValue({
                data: { session: null, user: null },
                error: { message: 'Invalid credentials' },
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await expect(
                act(async () => {
                    await result.current.signIn('test@example.com', 'wrong-password');
                })
            ).rejects.toThrow('Invalid credentials');
        });
    });

    describe('signUp()', () => {
        it('deve criar conta com sucesso', async () => {
            const mockUser = {
                id: 'new-user-123',
                email: 'newuser@example.com',
                user_metadata: { full_name: 'New User' },
            };

            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.signUp.mockResolvedValue({
                data: { user: mockUser, session: null },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.signUp('newuser@example.com', 'password123', 'New User');
            });

            expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
                email: 'newuser@example.com',
                password: 'password123',
                options: {
                    data: {
                        full_name: 'New User',
                    },
                },
            });
        });

        it('deve lançar erro quando email já existe', async () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.signUp.mockResolvedValue({
                data: { user: null, session: null },
                error: { message: 'User already registered' },
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await expect(
                act(async () => {
                    await result.current.signUp('existing@example.com', 'password123', 'User');
                })
            ).rejects.toThrow('User already registered');
        });
    });

    describe('signOut()', () => {
        it('deve fazer logout com sucesso', async () => {
            const mockSession = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                },
                access_token: 'token-123',
            };

            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession },
                error: null,
            });

            mockSupabase.auth.signOut.mockResolvedValue({
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockSession.user);
            });

            await act(async () => {
                await result.current.signOut();
            });

            expect(mockSupabase.auth.signOut).toHaveBeenCalled();
            expect(result.current.user).toBeNull();
            expect(result.current.session).toBeNull();
        });
    });

    describe('resetPassword()', () => {
        it('deve enviar email de recuperação com sucesso', async () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
                data: {},
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await act(async () => {
                await result.current.resetPassword('test@example.com');
            });

            expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
                'test@example.com'
            );
        });

        it('deve lançar erro quando email não existe', async () => {
            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: null },
                error: null,
            });

            mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
                data: null,
                error: { message: 'User not found' },
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            await expect(
                act(async () => {
                    await result.current.resetPassword('nonexistent@example.com');
                })
            ).rejects.toThrow('User not found');
        });
    });

    describe('updateProfile()', () => {
        it('deve atualizar perfil com sucesso', async () => {
            const mockSession = {
                user: {
                    id: 'user-123',
                    email: 'test@example.com',
                    user_metadata: { full_name: 'Old Name' },
                },
            };

            mockSupabase.auth.getSession.mockResolvedValue({
                data: { session: mockSession },
                error: null,
            });

            mockSupabase.auth.updateUser.mockResolvedValue({
                data: {
                    user: {
                        ...mockSession.user,
                        user_metadata: { full_name: 'New Name' },
                    },
                },
                error: null,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.user).toEqual(mockSession.user);
            });

            await act(async () => {
                await result.current.updateProfile({ full_name: 'New Name' });
            });

            expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
                data: { full_name: 'New Name' },
            });
        });
    });

    describe('refreshUser()', () => {
        it('deve atualizar dados do usuário', async () => {
            const initialUser = {
                id: 'user-123',
                email: 'test@example.com',
                user_metadata: { full_name: 'Old Name' },
            };

            const updatedUser = {
                id: 'user-123',
                email: 'test@example.com',
                user_metadata: { full_name: 'New Name', avatar_url: 'https://example.com/avatar.jpg' },
            };

            mockSupabase.auth.getSession
                .mockResolvedValueOnce({
                    data: { session: { user: initialUser } },
                    error: null,
                })
                .mockResolvedValueOnce({
                    data: { session: { user: updatedUser } },
                    error: null,
                });

            const { result } = renderHook(() => useAuth(), {
                wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
            });

            await waitFor(() => {
                expect(result.current.user?.user_metadata.full_name).toBe('Old Name');
            });

            await act(async () => {
                await result.current.refreshUser();
            });

            expect(result.current.user?.user_metadata.full_name).toBe('New Name');
            expect(result.current.user?.user_metadata.avatar_url).toBe('https://example.com/avatar.jpg');
        });
    });
});
