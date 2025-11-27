import React, { useState, useEffect } from "react";
import { X, Save, CreditCard } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { bancosService } from "../../services/bancos.service";
import type { Card, CardFormData } from "../../types/card";
import type { Banco } from "../../types/banco";

interface CardFormProps {
  card?: Card | null;
  onSubmit: (data: CardFormData) => Promise<void>;
  onCancel: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  card,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CardFormData>({
    name: "",
    bank_id: "",
    limit_amount: 0,
    closing_day: 1,
    due_day: 10,
    color: "#000000",
    brand: "",
  });
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBancos();
    if (card) {
      setFormData({
        name: card.name,
        bank_id: card.bank_id || "",
        limit_amount: card.limit_amount,
        closing_day: card.closing_day,
        due_day: card.due_day,
        color: card.color || "#000000",
        brand: card.brand || "",
      });
    }
  }, [card]);

  const loadBancos = async () => {
    try {
      setLoading(true);
      const data = await bancosService.list();
      setBancos(data);
    } catch (error) {
      console.error("Erro ao carregar bancos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBankChange = (bankId: string) => {
    const selectedBank = bancos.find((b) => b.id === bankId);
    setFormData((prev) => ({
      ...prev,
      bank_id: bankId,
      color: selectedBank?.color || prev.color, // Herda cor do banco se disponível
      name: prev.name || selectedBank?.name || "", // Sugere nome do banco se vazio
    }));
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
            {card ? "Editar Cartão" : "Novo Cartão"}
          </h3>
          <button
            onClick={onCancel}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Banco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Banco Emissor
            </label>
            <select
              value={formData.bank_id}
              onChange={(e) => handleBankChange(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <option value="">
                {loading
                  ? "Carregando bancos..."
                  : "Selecione um banco (opcional)"}
              </option>
              {bancos.map((banco) => (
                <option key={banco.id} value={banco.id}>
                  {banco.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nome */}
          <Input
            label="Nome do Cartão"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Ex: Nubank Platinum"
            leftIcon={<CreditCard size={18} />}
          />

          {/* Limite */}
          <Input
            label="Limite de Crédito"
            type="number"
            value={formData.limit_amount}
            onChange={(e) =>
              setFormData({ ...formData, limit_amount: Number(e.target.value) })
            }
            required
            min={0}
            step="0.01"
            placeholder="0,00"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Dia Fechamento */}
            <Input
              label="Dia do Fechamento"
              type="number"
              value={formData.closing_day}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  closing_day: Number(e.target.value),
                })
              }
              required
              min={1}
              max={31}
            />

            {/* Dia Vencimento */}
            <Input
              label="Dia do Vencimento"
              type="number"
              value={formData.due_day}
              onChange={(e) =>
                setFormData({ ...formData, due_day: Number(e.target.value) })
              }
              required
              min={1}
              max={31}
            />
          </div>

          {/* Cor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor do Cartão
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                "#000000",
                "#1F2937",
                "#DC2626",
                "#EA580C",
                "#D97706",
                "#16A34A",
                "#2563EB",
                "#4F46E5",
                "#7C3AED",
                "#DB2777",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </form>

        <div className="border-t border-gray-100 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
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
