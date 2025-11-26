import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { dashboardService } from '../../services/dashboard.service';

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalReceitas: 0,
        totalDespesas: 0,
        saldo: 0,
        percentualVariacao: 0
    });
    const [cardsCount, setCardsCount] = useState(0);
    const [cardsBill, setCardsBill] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [summaryData, cardsCountData, cardsBillData, transactionsData] = await Promise.all([
                dashboardService.getCurrentMonthSummary(),
                dashboardService.getActiveCardsCount(),
                dashboardService.getCardsTotalBill(),
                dashboardService.getRecentTransactions()
            ]);

            setSummary(summaryData);
            setCardsCount(cardsCountData);
            setCardsBill(cardsBillData);
            setRecentTransactions(transactionsData);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <RefreshCw size={48} className="animate-spin text-primary-600 dark:text-primary-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Visão geral das suas finanças
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Última atualização: {new Date().toLocaleString('pt-BR')}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Saldo Total */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Total</p>
                            <p className={`text-2xl font-bold mt-1 ${summary.saldo >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {formatCurrency(summary.saldo)}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                {summary.saldo >= 0 ? (
                                    <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                                ) : (
                                    <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                                )}
                                <span className={`text-sm ${summary.saldo >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {Math.abs(summary.percentualVariacao).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${summary.saldo >= 0
                                ? 'bg-green-100 dark:bg-green-900/20'
                                : 'bg-red-100 dark:bg-red-900/20'
                            }`}>
                            <Wallet size={24} className={
                                summary.saldo >= 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            } />
                        </div>
                    </div>
                </Card>

                {/* Receitas do Mês */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receitas do Mês</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {formatCurrency(summary.totalReceitas)}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" />
                                <span className="text-sm text-green-600 dark:text-green-400">
                                    +{((summary.totalReceitas / (summary.totalReceitas + summary.totalDespesas)) * 100 || 0).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <TrendingUp size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </Card>

                {/* Despesas do Mês */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Despesas do Mês</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                {formatCurrency(summary.totalDespesas)}
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowDownRight size={16} className="text-red-600 dark:text-red-400" />
                                <span className="text-sm text-red-600 dark:text-red-400">
                                    -{((summary.totalDespesas / (summary.totalReceitas + summary.totalDespesas)) * 100 || 0).toFixed(0)}%
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                            <TrendingDown size={24} className="text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </Card>

                {/* Cartões Ativos */}
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cartões Ativos</p>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                                {cardsCount}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                {formatCurrency(cardsBill)} fatura
                            </p>
                        </div>
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <CreditCard size={24} className="text-primary-600 dark:text-primary-400" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="mb-4">
                        <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                            Transações Recentes
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Últimas movimentações financeiras
                        </p>
                    </div>

                    {recentTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">
                                Nenhuma transação registrada ainda
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Comece adicionando receitas ou despesas
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={`${transaction.type}-${transaction.id}`}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${transaction.type === 'receita'
                                                ? 'bg-green-100 dark:bg-green-900/20'
                                                : 'bg-red-100 dark:bg-red-900/20'
                                            }`}>
                                            {transaction.type === 'receita' ? (
                                                <ArrowUpRight size={16} className="text-green-600 dark:text-green-400" />
                                            ) : (
                                                <ArrowDownRight size={16} className="text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {transaction.description}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {transaction.category} • {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-semibold ${transaction.type === 'receita'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.value)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card>
                    <div className="mb-4">
                        <h2 className="text-lg font-heading font-semibold text-gray-900 dark:text-white">
                            Resumo por Categoria
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Dados insuficientes para exibir o resumo
                        </p>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            Adicione transações para ver o resumo por categoria
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
