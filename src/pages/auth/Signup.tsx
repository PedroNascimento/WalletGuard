import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Signup: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Crie sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Faça login
                    </Link>
                </p>
            </div>

            <form className="space-y-6">
                <Input
                    label="Nome completo"
                    type="text"
                    placeholder="Seu nome"
                    fullWidth
                />

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

                <Input
                    label="Confirmar senha"
                    type="password"
                    placeholder="••••••••"
                    fullWidth
                />

                <Button type="submit" className="w-full">
                    Criar conta
                </Button>
            </form>
        </div>
    );
};
