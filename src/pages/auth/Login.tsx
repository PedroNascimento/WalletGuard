import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Entrar na sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ou{' '}
                    <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500">
                        crie uma nova conta
                    </Link>
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-md bg-red-50 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Lembrar-me
                        </label>
                    </div>

                    <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                            Esqueceu a senha?
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={loading}>
                    Entrar
                </Button>
            </form>
        </div>
    );
};
