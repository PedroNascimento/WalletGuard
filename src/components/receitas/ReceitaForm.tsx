import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Receita, ReceitaFormData } from "../../types/receita";
import { CATEGORIAS_RECEITA } from "../../types/receita";

interface ReceitaFormProps {
  receita?: Receita | null;
  onSubmit: (data: ReceitaFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ReceitaForm: React.FC<ReceitaFormProps> = ({
  receita,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ReceitaFormData>({
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split("T")[0],
    categoria: "Salário",
    recorrente: false,
    frequencia_recorrencia: null,
    observacoes: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ReceitaFormData, string>>
  >({});

  useEffect(() => {
    if (receita) {
      setFormData({
        descricao: receita.descricao,
        valor: receita.valor,
        data: receita.data,
        categoria: receita.categoria,
        recorrente: receita.recorrente,
        frequencia_recorrencia: receita.frequencia_recorrencia,
        observacoes: receita.observacoes || "",
      });
    }
  }, [receita]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ReceitaFormData, string>> = {};

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
        "Selecione a frequência da recorrência";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
    }
  };

  const handleChange = (
    field: keyof ReceitaFormData,
    value: ReceitaFormData[keyof ReceitaFormData],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {receita ? "Editar Receita" : "Nova Receita"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Descrição */}
          <div>
            <Input
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              placeholder="Ex: Salário mensal, Freelance projeto X"
              fullWidth
              required
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.descricao}
              </p>
            )}
          </div>

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) =>
                  handleChange("valor", parseFloat(e.target.value) || 0)
                }
                placeholder="0,00"
                fullWidth
                required
              />
              {errors.valor && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.valor}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Data"
                type="date"
                value={formData.data}
                onChange={(e) => handleChange("data", e.target.value)}
                fullWidth
                required
              />
              {errors.data && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.data}
                </p>
              )}
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => handleChange("categoria", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              {CATEGORIAS_RECEITA.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Recorrente */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recorrente"
                checked={formData.recorrente}
                onChange={(e) => {
                  handleChange("recorrente", e.target.checked);
                  if (!e.target.checked) {
                    handleChange("frequencia_recorrencia", null);
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="recorrente"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Receita recorrente
              </label>
            </div>

            {formData.recorrente && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequência
                </label>
                <select
                  value={formData.frequencia_recorrencia || ""}
                  onChange={(e) =>
                    handleChange(
                      "frequencia_recorrencia",
                      e.target.value || null,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange("observacoes", e.target.value)}
              placeholder="Adicione observações sobre esta receita..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              {receita ? "Atualizar" : "Criar"} Receita
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
