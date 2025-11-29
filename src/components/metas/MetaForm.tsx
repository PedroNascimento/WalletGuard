import { useState, useEffect, type FormEvent } from 'react';
import { type Meta, type MetaFormData, META_CATEGORIAS, META_CORES } from '../../types/meta';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { CurrencyInput } from '../ui/CurrencyInput';
import { X } from 'lucide-react';

interface MetaFormProps {
    initialData?: Meta;
    onSubmit: (data: MetaFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function MetaForm({ initialData, onSubmit, onCancel, isLoading }: MetaFormProps) {
    const [formData, setFormData] = useState<MetaFormData>({
        titulo: '',
        descricao: '',
        valor_alvo: 0,
        valor_atual: 0,
        categoria: 'economia',
        prazo: '',
        cor: META_CORES[0],
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo,
                descricao: initialData.descricao || '',
                valor_alvo: initialData.valor_alvo,
                valor_atual: initialData.valor_atual,
                categoria: initialData.categoria,
                prazo: initialData.prazo,
                cor: initialData.cor,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {initialData ? 'Editar Meta' : 'Nova Meta'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onCancel} type="button">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <Input
                label="Título da Meta"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
                placeholder="Ex: Viagem para Europa"
                fullWidth
                autoFocus
            />

            <div className="grid grid-cols-2 gap-4">
                <CurrencyInput
                    label="Valor Alvo"
                    value={formData.valor_alvo}
                    onChange={(val) => setFormData({ ...formData, valor_alvo: val })}
                    required
                    fullWidth
                />
                <CurrencyInput
                    label="Valor Inicial"
                    value={formData.valor_atual}
                    onChange={(val) => setFormData({ ...formData, valor_atual: val })}
                    required
                    fullWidth
                    disabled={!!initialData} // Não permitir editar valor atual diretamente na edição, usar contribuições
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Select
                    label="Categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                    options={META_CATEGORIAS.map(c => ({ value: c.value, label: c.label }))}
                    fullWidth
                />
                <Input
                    label="Prazo"
                    type="date"
                    value={formData.prazo}
                    onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                    required
                    fullWidth
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor de Identificação
                </label>
                <div className="flex flex-wrap gap-3">
                    {META_CORES.map((cor) => (
                        <button
                            key={cor}
                            type="button"
                            onClick={() => setFormData({ ...formData, cor })}
                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-2 ring-offset-2 dark:ring-offset-gray-900 ${formData.cor === cor ? 'ring-gray-400 scale-110' : 'ring-transparent'
                                }`}
                            style={{ backgroundColor: cor }}
                        />
                    ))}
                </div>
            </div>

            <Input
                label="Descrição (Opcional)"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Detalhes sobre seu objetivo..."
                fullWidth
            />

            <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Salvar Alterações' : 'Criar Meta'}
                </Button>
            </div>
        </form>
    );
}
