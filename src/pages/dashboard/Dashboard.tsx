import React from 'react';
import { Card } from '../../components/ui/Card';
import { TrendingUp, TrendingDown, CreditCard, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const stats = [
        {
            title: 'Saldo Total',
            value: 'R$ 12.450,00',
            change: '+12.5%',
            trend: 'up',
            icon: Wallet,
            color: 'primary',
        },
        {
            title: 'Receitas do Mês',
            value: 'R$ 8.500,00',
            change: '+8.2%',
            trend: 'up',
            icon: TrendingUp,
            color: 'green',
        },
        {
            title: 'Despesas do Mês',
            value: 'R$ 4.230,00',
            change: '-3.1%',
            trend: 'down',
            icon: TrendingDown,
            color: 'red',
        },
        {
            title: 'Cartões Ativos',
            value: '3',
            change: 'R$ 2.150,00 fatura',
            trend: 'neutral',
            icon: CreditCard,
            color: 'blue',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Visão geral das suas finanças</p>
                </div>
                <div className="text-sm text-gray-500">
                    Última atualização: {new Date().toLocaleDateString('pt-BR')}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const TrendIcon = stat.trend === 'up' ? ArrowUpRight : stat.trend === 'down' ? ArrowDownRight : null;

                    return (
                        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {TrendIcon && (
                                            <TrendIcon
                                                className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            />
                                        )}
                                        <span
                                            className={`text-sm font-medium ${stat.trend === 'up'
                                                    ? 'text-green-600'
                                                    : stat.trend === 'down'
                                                        ? 'text-red-600'
                                                        : 'text-gray-600'
                                                }`}
                                        >
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color === 'primary' ? 'bg-primary-100' :
                                        stat.color === 'green' ? 'bg-green-100' :
                                            stat.color === 'red' ? 'bg-red-100' :
                                                'bg-blue-100'
                                    }`}>
                                    <Icon className={`h-6 w-6 ${stat.color === 'primary' ? 'text-primary-700' :
                                            stat.color === 'green' ? 'text-green-700' :
                                                stat.color === 'red' ? 'text-red-700' :
                                                    'text-blue-700'
                                        }`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h3>
                    <div className="text-center py-12 text-gray-500">
                        <p>Nenhuma transação registrada ainda</p>
                        <p className="text-sm mt-2">Comece adicionando receitas ou despesas</p>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Categoria</h3>
                    <div className="text-center py-12 text-gray-500">
                        <p>Dados insuficientes</p>
                        <p className="text-sm mt-2">Adicione transações para ver o resumo</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
