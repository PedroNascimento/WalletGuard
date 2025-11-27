import React, { createContext, useContext, useEffect, useState } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
    signOut: () => Promise<{ error: any }>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
    resetPassword: async () => ({ error: null }),
    refreshUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthContext: Inicializando...');
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('AuthContext: Sessão inicial obtida:', session ? 'Autenticado' : 'Não autenticado');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log('AuthContext: Evento de auth:', _event, 'Sessão:', session ? 'Presente' : 'Ausente');
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Sync user to app_users if needed (e.g. on SIGNED_IN)
            if (_event === 'SIGNED_IN' && session?.user) {
                console.log('AuthContext: Sincronizando usuário...');
                await syncUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const syncUser = async (authUser: User) => {
        console.log('AuthContext: syncUser iniciado para:', authUser.email);

        try {
            // Timeout de 3 segundos para não travar o login
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout ao sincronizar usuário')), 3000);
            });

            await Promise.race([
                (async () => {
                    console.log('AuthContext: Verificando se usuário existe em app_users...');
                    // Check if user exists in app_users
                    const { data, error } = await supabase
                        .from('app_users')
                        .select('id')
                        .eq('auth_uid', authUser.id)
                        .single();

                    console.log('AuthContext: Resultado da verificação:', { data, error: error?.message });

                    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
                        console.error('Error checking app_users:', error);
                        return;
                    }

                    if (!data) {
                        console.log('AuthContext: Usuário não existe, criando...');
                        // User doesn't exist, insert them
                        const { error: insertError } = await supabase
                            .from('app_users')
                            .insert([
                                {
                                    id: authUser.id,
                                    auth_uid: authUser.id,
                                    email: authUser.email,
                                    name: authUser.user_metadata.name || authUser.email?.split('@')[0],
                                }
                            ]);

                        if (insertError) {
                            console.error('Error creating app_user:', insertError);
                        } else {
                            console.log('AuthContext: Usuário criado com sucesso');
                        }
                    } else {
                        console.log('AuthContext: Usuário já existe em app_users');
                    }
                })(),
                timeoutPromise
            ]);
        } catch (err) {
            console.warn('AuthContext: Erro ou timeout ao sincronizar usuário (continuando login):', err);
            // Não bloquear o login se a sincronização falhar
        }

        console.log('AuthContext: syncUser concluído');
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });
        return { error };
    };

    const signOut = async () => {
        console.log('AuthContext: Iniciando signOut...');

        try {
            // Criar uma promise de timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Timeout')), 2000);
            });

            // Tentar fazer logout no Supabase com timeout
            await Promise.race([
                supabase.auth.signOut(),
                timeoutPromise
            ]);

            console.log('AuthContext: signOut do Supabase concluído');
        } catch (error) {
            console.warn('AuthContext: Erro ou timeout no signOut do Supabase (prosseguindo com limpeza local):', error);
        } finally {
            // Sempre limpar o estado local, independente do resultado do Supabase
            console.log('AuthContext: Limpando estado local...');
            setSession(null);
            setUser(null);

            // Limpar também do localStorage se houver persistência manual
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            if (supabaseUrl) {
                // Tenta limpar chaves comuns do Supabase
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        }

        return { error: null };
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password',
        });
        return { error };
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
