import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Search, Filter } from 'lucide-react';
import type { RelatorioFilters } from '../../types/relatorio';

interface Props {
    filters: RelatorioFilters;
    onChange: (filters: RelatorioFilters) => void;
    onApply: () => void;
    loading?: boolean;
}

const CATEGORIAS = [
    'Todas',
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Serviços',
    'Outros'
];

export const RelatorioFiltersComponent: React.FC<Props> = ({ filters, onChange, onApply, loading }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Filter size={20} className="text-primary-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Filtros do Relatório</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    label="Data Início"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
                />
                <Input
                    label="Data Fim"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
                />
                <Select
                    label="Categoria"
                    value={filters.category || 'Todas'}
                    onChange={(e) => onChange({ ...filters, category: e.target.value === 'Todas' ? undefined : e.target.value })}
                    options={CATEGORIAS.map(c => ({ value: c, label: c }))}
                />
                <div className="flex items-end">
                    <Button onClick={onApply} isLoading={loading} className="w-full gap-2">
                        <Search size={18} />
                        Gerar Relatório
                    </Button>
                </div>
            </div>
        </div>
    );
};
