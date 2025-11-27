import React, { useState } from "react";
import { X, Save, DollarSign, Calendar, FileText, Layers } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import type { CardExpenseFormData } from "../../types/card";

interface CardExpenseFormProps {
  onSubmit: (data: CardExpenseFormData) => Promise<void>;
  onCancel: () => void;
}

const CATEGORIAS = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Vestuário",
  "Serviços",
  "Outros",
];

export const CardExpenseForm: React.FC<CardExpenseFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  // Estado local com value como string para permitir campo vazio
  const [formData, setFormData] = useState({
    description: "",
    value: "", // Inicializa vazio
    date: new Date().toISOString().split("T")[0],
    category: "Outros",
    installments: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      // Converte value para number ao enviar
      await onSubmit({
        ...formData,
        value: Number(formData.value),
      });
    } catch (error) {
      console.error("Erro ao salvar despesa:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-2xl transition-all flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nova Despesa no Cartão
          </h3>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="expense-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Descrição */}
          <Input
            label="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            placeholder="Ex: Supermercado"
            leftIcon={<FileText size={18} />}
          />

          {/* Valor */}
          <Input
            label="Valor Total"
            type="number"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            required
            min={0}
            step="0.01"
            placeholder="0,00"
            leftIcon={<DollarSign size={18} />}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Data */}
            <Input
              label="Data da Compra"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              leftIcon={<Calendar size={18} />}
            />

            {/* Parcelas */}
            <Input
              label="Parcelas"
              type="number"
              value={formData.installments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  installments: Math.max(1, Number(e.target.value)),
                })
              }
              required
              min={1}
              max={99}
              leftIcon={<Layers size={18} />}
            />
          </div>

          {/* Categoria */}
          <Select
            label="Categoria"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            options={CATEGORIAS.map((c) => ({ value: c, label: c }))}
          />

          {formData.installments > 1 && formData.value && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Simulação de Parcelamento:</p>
              <p>
                {formData.installments}x de{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(formData.value) / formData.installments)}
              </p>
            </div>
          )}
        </form>

        <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="expense-form"
            isLoading={submitting}
            className="gap-2"
          >
            <Save size={18} />
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
