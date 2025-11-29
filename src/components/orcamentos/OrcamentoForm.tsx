import { useState, useEffect, type FormEvent } from 'react';
import { type Orcamento, type OrcamentoFormData, type OrcamentoCategoria, MESES, CATEGORIAS_ORCAMENTO } from '../../types/orcamento';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { X, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/financial';

interface OrcamentoFormProps {
    initialData?: Orcamento;
    onSubmit: (data: OrcamentoFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function OrcamentoForm({ initialData, onSubmit, onCancel, isLoading }: OrcamentoFormProps) {
    const [formData, setFormData] = useState<OrcamentoFormData>({
        nome: '',
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        categorias: [],
    });

    // Estado para adicionar nova categoria
    const [newCat, setNewCat] = useState({
        categoria: CATEGORIAS_ORCAMENTO[0].value,
        valor: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nome: initialData.nome,
                mes: initialData.mes,
                ano: initialData.ano,
                categorias: initialData.categorias,
            });
        } else {
            // Sugerir nome padrão
            const mesNome = MESES.find(m => m.value === formData.mes)?.label;
            setFormData(prev => ({ ...prev, nome: `Orçamento ${mesNome} ${prev.ano}` }));
        }
    }, [initialData]);

    // Atualizar nome sugerido quando mudar mês/ano (apenas se for novo)
    useEffect(() => {
        if (!initialData) {
            const mesNome = MESES.find(m => m.value === formData.mes)?.label;
            setFormData(prev => ({ ...prev, nome: `Orçamento ${mesNome} ${prev.ano}` }));
        }
    }, [formData.mes, formData.ano, initialData]);

    const handleAddCategory = () => {
        if (newCat.valor <= 0) return;

        const catInfo = CATEGORIAS_ORCAMENTO.find(c => c.value === newCat.categoria);
        const novaCategoria: OrcamentoCategoria = {
            categoria: newCat.categoria,
            valor_planejado: newCat.valor,
            valor_gasto: 0,
            cor: catInfo?.cor || '#6B7280'
        };

        // Verificar se já existe
        const exists = formData.categorias.find(c => c.categoria === newCat.categoria);
        if (exists) {
            setFormData(prev => ({
                ...prev,
                categorias: prev.categorias.map(c =>
                    c.categoria === newCat.categoria
                        ? { ...c, valor_planejado: newCat.valor } // Atualiza valor
                        : c
                )
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                categorias: [...prev.categorias, novaCategoria]
            }));
        }

        // Resetar input
        setNewCat(prev => ({ ...prev, valor: 0 }));
    };

    const handleRemoveCategory = (categoria: string) => {
        setFormData(prev => ({
            ...prev,
            categorias: prev.categorias.filter(c => c.categoria !== categoria)
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (formData.categorias.length === 0) {
            alert('Adicione pelo menos uma categoria ao orçamento.');
            return;
        }
        await onSubmit(formData);
    };

    const totalPlanejado = formData.categorias.reduce((sum, c) => sum + c.valor_planejado, 0);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {initialData ? 'Editar Orçamento' : 'Novo Orçamento'}
                </h2>
                <Button variant="ghost" size="icon" onClick={onCancel} type="button">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                    <Input
                        label="Nome do Orçamento"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        required
                        fullWidth
                    />
                </div>

                <Select
                    label="Mês"
                    value={formData.mes}
                    onChange={(e) => setFormData({ ...formData, mes: Number(e.target.value) })}
                    options={MESES.map(m => ({ value: m.value, label: m.label }))}
                    fullWidth
                />

                <Input
                    label="Ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: Number(e.target.value) })}
                    required
                    fullWidth
                    min="2020"
                    max="2030"
                />

                <div className="flex flex-col justify-end pb-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Planejado</div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(totalPlanejado)}
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Categorias e Limites</h3>

                <div className="flex gap-2 items-end mb-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex-1">
                        <Select
                            label="Categoria"
                            value={newCat.categoria}
                            onChange={(e) => setNewCat({ ...newCat, categoria: e.target.value })}
                            options={CATEGORIAS_ORCAMENTO.map(c => ({ value: c.value, label: c.label }))}
                            fullWidth
                        />
                    </div>
                    <div className="flex-1">
                        <Input
                            label="Limite (R$)"
                            type="number"
                            value={newCat.valor}
                            onChange={(e) => setNewCat({ ...newCat, valor: Number(e.target.value) })}
                            min="0"
                            step="0.01"
                            fullWidth
                        />
                    </div>
                    <Button type="button" onClick={handleAddCategory} disabled={newCat.valor <= 0}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {formData.categorias.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">
                            Nenhuma categoria adicionada.
                        </p>
                    )}

                    {formData.categorias.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white capitalize">{cat.categoria}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Planejado: {formatCurrency(cat.valor_planejado)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveCategory(cat.categoria)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button variant="outline" onClick={onCancel} type="button">
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData ? 'Salvar Alterações' : 'Criar Orçamento'}
                </Button>
            </div>
        </form>
    );
}
