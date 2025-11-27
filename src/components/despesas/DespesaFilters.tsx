import React from "react";
import { Search, X } from "lucide-react";
import type { DespesaFilters } from "../../types/despesa";
import { CATEGORIAS_DESPESA, TIPOS_DESPESA } from "../../types/despesa";

interface DespesaFiltersProps {
  filters: DespesaFilters;
  onFiltersChange: (filters: DespesaFilters) => void;
}

export const DespesaFiltersComponent: React.FC<DespesaFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => filters[key as keyof DespesaFilters],
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Busca */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              placeholder="Buscar por descrição..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Data Início */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Início
          </label>
          <input
            type="date"
            value={filters.dataInicio || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dataInicio: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Data Fim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Data Fim
          </label>
          <input
            type="date"
            value={filters.dataFim || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dataFim: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria
          </label>
          <select
            value={filters.categoria || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                categoria: e.target.value || undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todas</option>
            {CATEGORIAS_DESPESA.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tipo
          </label>
          <select
            value={filters.tipo || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                tipo: e.target.value as "fixa" | "variavel" | undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Todos</option>
            {TIPOS_DESPESA.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <div className="flex items-end lg:col-span-5">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={16} />
              Limpar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
