import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, RefreshCw, TrendingUp, Repeat } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ReceitaForm } from '../../components/receitas/ReceitaForm';
import { ReceitaFiltersComponent } from '../../components/receitas/ReceitaFilters';
import { receitasService } from '../../services/receitas.service';
import type { Receita, ReceitaFormData, ReceitaFilters } from '../../types/receita';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export const Receitas: React.FC = () => {
    const [receitas, setReceitas] = useState<Receita[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingReceita, setEditingReceita] = useState<Receita | null>(null);
    const [filters, setFilters] = useState<ReceitaFilters>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
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
        loadReceitas();
        loadStats();
    }, [filters, page]);

    const loadReceitas = async () => {
        try {
            setLoading(true);
            const result = await receitasService.list(filters, page, pageSize);
            setReceitas(result.data);
            setTotalPages(result.totalPages);
            setTotalCount(result.count);
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            // alert('Erro ao carregar receitas. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await receitasService.getStats(
                filters.dataInicio,
                filters.dataFim
            );
            setStats(statsData);
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const handleCreate = async (data: ReceitaFormData) => {
        try {
            await receitasService.create(data);
            setShowForm(false);
            loadReceitas();
            loadStats();
        } catch (error) {
            console.error('Erro ao criar receita:', error);
            alert('Erro ao criar receita. Tente novamente.');
        }
    };

    const handleUpdate = async (data: ReceitaFormData) => {
        if (!editingReceita) return;

        try {
            await receitasService.update(editingReceita.id, data);
            setShowForm(false);
            setEditingReceita(null);
            loadReceitas();
            loadStats();
        } catch (error) {
            console.error('Erro ao atualizar receita:', error);
            alert('Erro ao atualizar receita. Tente novamente.');
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteConfirmation({ isOpen: true, id });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.id) return;

        try {
            setIsDeleting(true);
            console.log('Excluindo receita:', deleteConfirmation.id);
            await receitasService.delete(deleteConfirmation.id);
            console.log('Receita excluída com sucesso');

            setDeleteConfirmation({ isOpen: false, id: null });
            loadReceitas();
            loadStats();
        } catch (error: any) {
            console.error('Erro ao excluir receita:', error);
            alert(`Erro ao excluir: ${error.message || 'Erro desconhecido'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (receita: Receita) => {
        setEditingReceita(receita);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingReceita(null);
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
                        Receitas
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Gerencie suas receitas e acompanhe seus ganhos
                    </p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus size={20} />
                    Nova Receita
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Receitas</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {formatCurrency(stats.total)}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receitas Recorrentes</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {stats.recorrentes}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Repeat size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Quantidade</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.quantidade}
                            </p>
                        </div>
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <RefreshCw size={24} className="text-gray-600 dark:text-gray-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <ReceitaFiltersComponent
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
                    ) : receitas.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                Nenhuma receita encontrada.
                            </p>
                            <Button onClick={() => setShowForm(true)} className="mt-4 gap-2">
                                <Plus size={20} />
                                Adicionar primeira receita
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
                                    {receitas.map((receita) => (
                                        <tr key={receita.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {receita.descricao}
                                                </div>
                                                {receita.observacoes && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {receita.observacoes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                                                    {receita.categoria}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                                    {formatCurrency(receita.valor)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {formatDate(receita.data)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {receita.recorrente ? (
                                                    <div className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400">
                                                        <Repeat size={16} />
                                                        {receita.frequencia_recorrencia}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(receita)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} className="text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(receita.id)}
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
                                        Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount} receitas
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
                <ReceitaForm
                    receita={editingReceita}
                    onSubmit={editingReceita ? handleUpdate : handleCreate}
                    onCancel={handleCloseForm}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => setDeleteConfirmation({ isOpen: false, id: null })}
                onConfirm={handleConfirmDelete}
                title="Excluir Receita"
                message="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
                isLoading={isDeleting}
            />
        </div>
    );
};
