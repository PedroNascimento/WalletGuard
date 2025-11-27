import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, DollarSign, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CardExpenseForm } from '../../components/cartoes/CardExpenseForm';
import { cardsService } from '../../services/cards.service';
import type { Card as CardType, CardExpense, InvoiceSummary } from '../../types/card';

export const GastosCartao: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [card, setCard] = useState<CardType | null>(null);
    const [expenses, setExpenses] = useState<CardExpense[]>([]);
    const [summary, setSummary] = useState<InvoiceSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Data de referência para a fatura (mês/ano)
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (id) {
            loadCardAndExpenses();
        }
    }, [id, currentDate]);

    const loadCardAndExpenses = async () => {
        if (!id) return;
        try {
            setLoading(true);
            // Carrega cartão se ainda não tiver
            if (!card) {
                const cardData = await cardsService.getById(id);
                setCard(cardData);
            }

            // Carrega despesas da fatura do mês selecionado
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const { expenses: expensesData, summary: summaryData } = await cardsService.getExpenses(id, month, year);

            setExpenses(expensesData);
            setSummary(summaryData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            alert('Erro ao carregar dados do cartão.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExpense = async (data: any) => {
        if (!id) return;
        try {
            await cardsService.createExpense(id, data);
            setShowForm(false);
            loadCardAndExpenses();
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            alert('Erro ao criar despesa. Tente novamente.');
        }
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        const [, month, day] = dateStr.split('-');
        return `${day}/${month}`;
    };

    const getMonthName = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    };

    if (loading && !card) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!card) return <div>Cartão não encontrado</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/cartoes')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {card.name}
                            <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {card.brand}
                            </span>
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Limite: {formatCurrency(card.limit_amount)}
                        </p>
                    </div>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus size={20} />
                    Nova Despesa
                </Button>
            </div>

            {/* Invoice Navigation & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Navegação e Status */}
                <Card className="md:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={24} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                Fatura de {getMonthName(currentDate)}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Vence em {summary?.dueDate ? formatDate(summary.dueDate) : '-'}
                            </p>
                        </div>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronRight size={24} className="text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status da Fatura</p>
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${summary?.status === 'closed'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    : summary?.status === 'future'
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                }`}>
                                {summary?.status === 'closed' ? 'Fechada' : summary?.status === 'future' ? 'Futura' : 'Aberta'}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fechamento</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {summary?.closingDate ? formatDate(summary.closingDate) : '-'}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Valor Total */}
                <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none">
                    <div className="h-full flex flex-col justify-center items-center text-center p-4">
                        <DollarSign size={32} className="mb-2 opacity-80" />
                        <p className="text-primary-100 text-sm uppercase tracking-wider font-medium">Valor da Fatura</p>
                        <p className="text-3xl font-bold mt-1">
                            {formatCurrency(summary?.total || 0)}
                        </p>
                        <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-white h-full rounded-full"
                                style={{ width: `${Math.min(100, ((summary?.total || 0) / card.limit_amount) * 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-primary-100 mt-2">
                            {Math.round(((summary?.total || 0) / card.limit_amount) * 100)}% do limite utilizado
                        </p>
                    </div>
                </Card>
            </div>

            {/* Lista de Gastos */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parcela</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        Nenhum gasto nesta fatura.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(expense.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {expense.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {expense.installments > 1 ? (
                                                <div className="flex items-center gap-1">
                                                    <Layers size={14} />
                                                    {expense.installment_current}/{expense.installments}
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(expense.value)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Form Modal */}
            {showForm && (
                <CardExpenseForm
                    onSubmit={handleCreateExpense}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
};
