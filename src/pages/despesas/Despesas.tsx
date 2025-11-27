import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, TrendingDown, Repeat, DollarSign, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DespesaForm } from '../../components/despesas/DespesaForm';
import { DespesaFiltersComponent } from '../../components/despesas/DespesaFilters';
import { despesasService } from '../../services/despesas.service';
import type { Despesa, DespesaFormData, DespesaFilters } from '../../types/despesa';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export const Despesas: React.FC = () => {
    const [despesas, setDespesas] = useState<Despesa[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null);
    const [filters, setFilters] = useState<DespesaFilters>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        fixas: 0,
        variaveis: 0,
        recorrentes: 0,
        quantidade: 0
    });

    // Estado para confirmação de exclusão
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; id: string | null }>({
        isOpen: false,
        id: null
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const pageSize = 10;

    useEffect(() => {
        loadDespesas();
        loadStats();
    }, [filters, page]);

    const loadDespesas = async () => {
        try {
            setLoading(true);
            const result = await despesasService.list(filters, page, pageSize);
            setDespesas(result.data);
            setTotalPages(result.totalPages);
            setTotalCount(result.count);
        } catch (error) {
            console.error('Erro ao carregar despesas:', error);
            alert('Erro ao carregar despesas. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await despesasService.getStats(
                filters.dataInicio,
                filters.dataFim
            );
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const handleCreate = async (data: DespesaFormData) => {
        try {
            await despesasService.create(data);
            setShowForm(false);
            loadDespesas();
            loadStats();
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            throw error;
        }
    };

    const handleUpdate = async (data: DespesaFormData) => {
        if (!editingDespesa) return;

        try {
            await despesasService.update(editingDespesa.id, data);
            setShowForm(false);
            setEditingDespesa(null);
            loadDespesas();
            loadStats();
        } catch (error) {
            console.error('Erro ao atualizar despesa:', error);
            throw error;
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.id) return;

        try {
            setIsDeleting(true);
            console.log('Excluindo despesa:', deleteConfirmation.id);
            await despesasService.delete(deleteConfirmation.id);
            console.log('Despesa excluída com sucesso');

            setDeleteConfirmation({ isOpen: false, id: null });
            loadDespesas();
            loadStats();
        } catch (error: any) {
            console.error('Erro ao excluir despesa:', error);
            alert(`Erro ao excluir: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (despesa: Despesa) => {
        setEditingDespesa(despesa);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingDespesa(null);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                        Despesas
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Gerencie suas despesas e controle seus gastos
                    </p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus size={20} />
                    Nova Despesa
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Despesas</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                {formatCurrency(stats.total)}
                            </p>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Despesas Fixas</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                                {stats.fixas}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                            <DollarSign size={24} className="text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Despesas Variáveis</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                {stats.variaveis}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <FileText size={24} className="text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Recorrentes</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                                {stats.recorrentes}
                            </p>
                        </div>
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <Repeat size={24} className="text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <DespesaFiltersComponent
                filters={filters}
                onFiltersChange={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                }}
            />

            {/* Table */}
            <Card>
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw size={32} className="animate-spin text-primary-600 dark:text-primary-400" />
                        </div>
                    ) : despesas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                Nenhuma despesa encontrada.
                            </p>
                            <Button onClick={() => setShowForm(true)} className="mt-4 gap-2">
                                <Plus size={20} />
                                Adicionar primeira despesa
                            </Button>
                        </div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Descrição
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Valor
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Recorrente
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {despesas.map((despesa) => (
                                        <tr key={despesa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {despesa.descricao}
                                                </div>
                                                {despesa.observacoes && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {despesa.observacoes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                                                    {despesa.categoria}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${despesa.tipo === 'fixa'
                                                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300'
                                                    : 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300'
                                                    }`}>
                                                    {despesa.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                    {formatCurrency(despesa.valor)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(despesa.data)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {despesa.recorrente ? (
                                                    <div className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                                                        <Repeat size={16} />
                                                        {despesa.frequencia_recorrencia}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(despesa)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(despesa.id)}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} despesas
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            Próxima
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>

            {/* Form Modal */}
            {showForm && (
                <DespesaForm
                    despesa={editingDespesa}
                    onSubmit={editingDespesa ? handleUpdate : handleCreate}
                    onCancel={handleCloseForm}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Excluir Despesa"
                message="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
                isLoading={isDeleting}
            />
        </div>
    );
};
