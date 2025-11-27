import React from "react";
import { Search, X } from "lucide-react";
import type { ReceitaFilters } from "../../types/receita";
import { CATEGORIAS_RECEITA } from "../../types/receita";

interface ReceitaFiltersProps {
  filters: ReceitaFilters;
  onFiltersChange: (filters: ReceitaFilters) => void;
}

export const ReceitaFiltersComponent: React.FC<ReceitaFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const handleChange = (field: keyof ReceitaFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Filtros
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
          >
            <X size={14} />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Busca */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Buscar descrição..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Data Início */}
        <div>
          <input
            type="date"
            value={filters.dataInicio || ""}
            onChange={(e) => handleChange("dataInicio", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="Data início"
          />
        </div>

        {/* Data Fim */}
        <div>
          <input
            type="date"
            value={filters.dataFim || ""}
            onChange={(e) => handleChange("dataFim", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            placeholder="Data fim"
          />
        </div>

        {/* Categoria */}
        <div>
          <select
            value={filters.categoria || ""}
            onChange={(e) => handleChange("categoria", e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS_RECEITA.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
