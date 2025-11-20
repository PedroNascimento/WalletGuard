import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Login: React.FC = () => {
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

            <form className="space-y-6">
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    fullWidth
                />

                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
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
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                            Esqueceu a senha?
                        </a>
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Entrar
                </Button>
            </form>
        </div>
    );
};
