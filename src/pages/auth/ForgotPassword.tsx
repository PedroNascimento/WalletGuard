import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await resetPassword(email);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Instruções de recuperação enviadas para seu e-mail.' });
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Recuperar senha
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Digite seu e-mail para receber as instruções
                </p>
            </div>

            {message && (
                <div className={`p-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
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

                <Button type="submit" className="w-full" isLoading={loading}>
                    Enviar instruções
                </Button>
            </form>

            <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o login
                </Link>
            </div>
        </div>
    );
};
