import React from 'react';
import { Card } from '../../components/ui/Card';

export const Dashboard: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500">Visão geral das suas finanças</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <div className="text-sm font-medium text-gray-500">Saldo Total</div>
                    <div className="mt-2 text-3xl font-bold text-gray-900">R$ 0,00</div>
                </Card>
                <Card>
                    <div className="text-sm font-medium text-gray-500">Receitas (Mês)</div>
                    <div className="mt-2 text-3xl font-bold text-green-600">R$ 0,00</div>
                </Card>
                <Card>
                    <div className="text-sm font-medium text-gray-500">Despesas (Mês)</div>
                    <div className="mt-2 text-3xl font-bold text-red-600">R$ 0,00</div>
                </Card>
                <Card>
                    <div className="text-sm font-medium text-gray-500">Cartões (Fatura)</div>
                    <div className="mt-2 text-3xl font-bold text-orange-600">R$ 0,00</div>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="h-96">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Evolução Mensal</h3>
                    </div>
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Gráfico de Linha
                    </div>
                </Card>
                <Card className="h-96">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Despesas por Categoria</h3>
                    </div>
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Gráfico de Pizza
                    </div>
                </Card>
            </div>
        </div>
    );
};
