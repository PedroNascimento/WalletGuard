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
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => ({ error: null }),
    resetPassword: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);

            // Sync user to app_users if needed (e.g. on SIGNED_IN)
            if (_event === 'SIGNED_IN' && session?.user) {
                await syncUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const syncUser = async (authUser: User) => {
        try {
            // Check if user exists in app_users
            const { data, error } = await supabase
                .from('app_users')
                .select('id')
                .eq('auth_uid', authUser.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
                console.error('Error checking app_users:', error);
                return;
            }

            if (!data) {
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
                }
            }
        } catch (err) {
            console.error('Unexpected error syncing user:', err);
        }
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
        const { error } = await supabase.auth.signOut();
        return { error };
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/update-password',
        });
        return { error };
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
