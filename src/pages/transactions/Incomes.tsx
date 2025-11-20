import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus } from 'lucide-react';

export const Incomes: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Receitas</h2>
                    <p className="text-gray-500">Gerencie suas entradas financeiras</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Receita
                </Button>
            </div>

            <Card>
                <div className="text-center py-12 text-gray-500">
                    Nenhuma receita cadastrada.
                </div>
            </Card>
        </div>
    );
};
