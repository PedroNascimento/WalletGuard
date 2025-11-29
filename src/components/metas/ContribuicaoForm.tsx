import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

interface ContribuicaoFormProps {
    metaTitulo: string;
    onSubmit: (valor: number, observacao?: string) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ContribuicaoForm({ metaTitulo, onSubmit, onCancel, isLoading }: ContribuicaoFormProps) {
    const [valor, setValor] = useState<number>(0);
    const [observacao, setObservacao] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (valor <= 0) return;
        await onSubmit(valor, observacao);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Adicionar Valor</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Para: {metaTitulo}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onCancel} type="button">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <Input
                label="Valor da Contribuição (R$)"
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                required
                min="0.01"
                fullWidth
                autoFocus
            />

            <Input
                label="Observação (Opcional)"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: Economia do mês"
                fullWidth
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading} disabled={valor <= 0}>
                    Confirmar Contribuição
                </Button>
            </div>
        </form>
    );
}
