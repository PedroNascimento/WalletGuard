import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Despesa, DespesaFormData } from "../../types/despesa";
import { CATEGORIAS_DESPESA, TIPOS_DESPESA } from "../../types/despesa";

import { useToast } from "../../context/ToastContext";

interface DespesaFormProps {
  despesa?: Despesa | null;
  onSubmit: (data: DespesaFormData) => Promise<void>;
  onCancel: () => void;
}

export const DespesaForm: React.FC<DespesaFormProps> = ({
  despesa,
  onSubmit,
  onCancel,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<DespesaFormData>({
    descricao: "",
    valor: "" as any,
    data: new Date().toISOString().split("T")[0],
    categoria: CATEGORIAS_DESPESA[0],
    tipo: "variavel",
    recorrente: false,
    frequencia_recorrencia: undefined,
    observacoes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (despesa) {
      setFormData({
        descricao: despesa.descricao,
        valor: despesa.valor,
        data: despesa.data,
        categoria: despesa.categoria,
        tipo: despesa.tipo,
        recorrente: despesa.recorrente,
        frequencia_recorrencia: despesa.frequencia_recorrencia,
        observacoes: despesa.observacoes || "",
      });
    }
  }, [despesa]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (formData.valor <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    }

    if (!formData.data) {
      newErrors.data = "Data é obrigatória";
    }

    if (formData.recorrente && !formData.frequencia_recorrencia) {
      newErrors.frequencia_recorrencia =
        "Frequência é obrigatória para despesas recorrentes";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
      addToast("Erro ao salvar despesa. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {despesa ? "Editar Despesa" : "Nova Despesa"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Descrição */}
          <Input
            label="Descrição"
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
            error={errors.descricao}
            placeholder="Ex: Conta de luz"
            required
            fullWidth
          />

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Valor (R$)"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valor: parseFloat(e.target.value) || 0,
                })
              }
              error={errors.valor}
              placeholder="0,00"
              required
              fullWidth
            />

            <Input
              label="Data"
              type="date"
              value={formData.data}
              onChange={(e) =>
                setFormData({ ...formData, data: e.target.value })
              }
              error={errors.data}
              required
              fullWidth
            />
          </div>

          {/* Categoria e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {CATEGORIAS_DESPESA.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value as "fixa" | "variavel",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {TIPOS_DESPESA.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recorrente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recorrente"
              checked={formData.recorrente}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recorrente: e.target.checked,
                  frequencia_recorrencia: e.target.checked
                    ? "mensal"
                    : undefined,
                })
              }
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="recorrente"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Despesa recorrente
            </label>
          </div>

          {/* Frequência de Recorrência */}
          {formData.recorrente && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequência de Recorrência *
              </label>
              <select
                value={formData.frequencia_recorrencia || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequencia_recorrencia: e.target.value as
                      | "semanal"
                      | "mensal"
                      | "anual",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione...</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
              {errors.frequencia_recorrencia && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.frequencia_recorrencia}
                </p>
              )}
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              rows={3}
              placeholder="Adicione observações sobre esta despesa..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? "Salvando..."
                : despesa
                  ? "Atualizar Despesa"
                  : "Criar Despesa"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
