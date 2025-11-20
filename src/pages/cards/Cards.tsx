import React from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Plus } from 'lucide-react';

export const Cards: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cartões de Crédito</h2>
                    <p className="text-gray-500">Gerencie seus cartões e faturas</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cartão
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="text-center">
                        <Plus className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            Adicionar novo cartão
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};
