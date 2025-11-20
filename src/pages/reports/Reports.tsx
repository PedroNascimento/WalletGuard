import React from 'react';
import { Card } from '../../components/ui/Card';

export const Reports: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
                <p className="text-gray-500">Análise detalhada das suas finanças</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="h-80">
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Receitas x Despesas
                    </div>
                </Card>
                <Card className="h-80">
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Gastos por Categoria
                    </div>
                </Card>
            </div>
        </div>
    );
};
