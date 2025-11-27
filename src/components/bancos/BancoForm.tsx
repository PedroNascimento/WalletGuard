import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Banco, BancoFormData } from "../../types/banco";
import { TIPOS_BANCO, CORES_BANCO } from "../../types/banco";

import { useToast } from "../../context/ToastContext";

interface BancoFormProps {
  banco?: Banco | null;
  onSubmit: (data: BancoFormData) => Promise<void>;
  onCancel: () => void;
}

export const BancoForm: React.FC<BancoFormProps> = ({
  banco,
  onSubmit,
  onCancel,
}) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState<BancoFormData>({
    name: "",
    type: "corrente",
    color: "#3B82F6",
    balance: "" as any,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banco) {
      setFormData({
        name: banco.name,
        type: banco.type,
        color: banco.color,
        balance: banco.balance,
      });
    }
  }, [banco]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
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
      // Converter balance para número
      const dataToSubmit = {
        ...formData,
        balance: parseFloat(formData.balance as any) || 0,
      };
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Erro ao salvar banco:", error);
      addToast("Erro ao salvar banco. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {banco ? "Editar Banco" : "Novo Banco"}
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
          {/* Nome */}
          <Input
            label="Nome do Banco"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Ex: Nubank, Banco do Brasil"
            required
            fullWidth
          />

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Conta
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as
                    | "corrente"
                    | "poupanca"
                    | "investimento",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              {TIPOS_BANCO.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor (para gráficos)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {CORES_BANCO.map((cor) => (
                <button
                  key={cor.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: cor.value })}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    formData.color === cor.value
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-gray-300 dark:border-gray-600 hover:scale-105"
                  }`}
                  style={{ backgroundColor: cor.value }}
                  title={cor.label}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Cor selecionada:{" "}
              {CORES_BANCO.find((c) => c.value === formData.color)?.label}
            </p>
          </div>

          {/* Saldo Inicial */}
          <Input
            label="Saldo Inicial (R$)"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) =>
              setFormData({
                ...formData,
                balance: parseFloat(e.target.value) || 0,
              })
            }
            placeholder="0,00"
            fullWidth
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? "Salvando..."
                : banco
                  ? "Atualizar Banco"
                  : "Criar Banco"}
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
