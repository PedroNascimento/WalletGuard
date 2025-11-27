import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CreditCard, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CardForm } from "../../components/cartoes/CardForm";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { cardsService } from "../../services/cards.service";
import type { Card as CardType, CardFormData } from "../../types/card";

import { useToast } from "../../context/ToastContext";

export const Cartoes: React.FC = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [cartoes, setCartoes] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  // Estado para confirmação de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    card: CardType | null;
  }>({
    isOpen: false,
    card: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadCartoes();
  }, []);

  const loadCartoes = async () => {
    try {
      setLoading(true);
      const data = await cardsService.list();
      setCartoes(data);
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
      addToast("Erro ao carregar cartões.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CardFormData) => {
    try {
      await cardsService.create(data);
      setShowForm(false);
      loadCartoes();
      addToast("Cartão criado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      addToast("Erro ao criar cartão. Tente novamente.", "error");
    }
  };

  const handleUpdate = async (data: CardFormData) => {
    if (!editingCard) return;
    try {
      await cardsService.update(editingCard.id, data);
      setShowForm(false);
      setEditingCard(null);
      loadCartoes();
      addToast("Cartão atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar cartão:", error);
      addToast("Erro ao atualizar cartão. Tente novamente.", "error");
    }
  };

  const handleDeleteClick = (card: CardType) => {
    setDeleteConfirmation({ isOpen: true, card });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.card) return;
    try {
      setIsDeleting(true);
      await cardsService.delete(deleteConfirmation.card.id);
      setDeleteConfirmation({ isOpen: false, card: null });
      loadCartoes();
      addToast("Cartão excluído com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao excluir cartão:", error);
      addToast(
        `Erro ao excluir: ${error.message || "Erro desconhecido"}`,
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, card: CardType) => {
    e.stopPropagation(); // Evita navegar para detalhes
    setEditingCard(card);
    setShowForm(true);
  };

  const handleDelete = (e: React.MouseEvent, card: CardType) => {
    e.stopPropagation(); // Evita navegar para detalhes
    handleDeleteClick(card);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Cartões de Crédito
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie seus cartões e acompanhe suas faturas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Novo Cartão
        </Button>
      </div>

      {/* Lista de Cartões */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : cartoes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nenhum cartão cadastrado.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus size={20} />
              Adicionar primeiro cartão
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartoes.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(`/cartoes/${card.id}/gastos`)}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${card.color || "#1F2937"}, ${adjustColor(card.color || "#1F2937", -40)})`,
              }}
            >
              <div className="p-6 h-48 flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold tracking-wide">
                      {card.name}
                    </h3>
                    {card.brand && (
                      <p className="text-white/70 text-sm">{card.brand}</p>
                    )}
                  </div>
                  <CreditCard className="text-white/50" size={32} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
                        Limite
                      </p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(card.limit_amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70 uppercase tracking-wider mb-1">
                        Fechamento / Venc.
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Dia {card.closing_day}
                        </span>
                        <span className="text-white/40">|</span>
                        <span className="flex items-center gap-1">
                          Dia {card.due_day}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações (aparecem no hover) */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                  onClick={(e) => handleEdit(e, card)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, card)}
                  className="p-2 bg-white/10 hover:bg-red-500/50 rounded-lg backdrop-blur-sm transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Overlay decorativo */}
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <CardForm
          card={editingCard}
          onSubmit={editingCard ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditingCard(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, card: null })}
        onConfirm={handleConfirmDelete}
        title="Excluir Cartão"
        message={`Tem certeza que deseja excluir o cartão "${deleteConfirmation.card?.name}"? Todas as despesas associadas também serão excluídas.`}
        isLoading={isDeleting}
      />
    </div>
  );
};

// Helper para escurecer a cor para o gradiente
function adjustColor(color: string, amount: number) {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2),
      )
  );
}
