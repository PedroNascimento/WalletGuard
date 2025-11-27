import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Building2,
  Wallet,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { BancoForm } from "../../components/bancos/BancoForm";
import { bancosService } from "../../services/bancos.service";
import type { Banco, BancoFormData, BancoFilters } from "../../types/banco";
import { TIPOS_BANCO } from "../../types/banco";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

import { useToast } from "../../context/ToastContext";

export const Bancos: React.FC = () => {
  const { addToast } = useToast();
  const [bancos, setBancos] = useState<Banco[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanco, setEditingBanco] = useState<Banco | null>(null);
  const [filters, setFilters] = useState<BancoFilters>({});
  const [stats, setStats] = useState({
    total: 0,
    corrente: 0,
    poupanca: 0,
    investimento: 0,
    quantidade: 0,
  });

  // Estado para confirmação de exclusão
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    banco: Banco | null;
    message: string;
  }>({
    isOpen: false,
    banco: null,
    message: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadBancos();
    loadStats();
  }, [filters]);

  const loadBancos = async () => {
    try {
      setLoading(true);
      const data = await bancosService.list(filters);
      setBancos(data);
    } catch (error) {
      console.error("Erro ao carregar bancos:", error);
      addToast("Erro ao carregar bancos. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await bancosService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleCreate = async (data: BancoFormData) => {
    try {
      await bancosService.create(data);
      setShowForm(false);
      loadBancos();
      loadStats();
      addToast("Banco criado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao criar banco:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: BancoFormData) => {
    if (!editingBanco) return;

    try {
      await bancosService.update(editingBanco.id, data);
      setShowForm(false);
      setEditingBanco(null);
      loadBancos();
      loadStats();
      addToast("Banco atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar banco:", error);
      throw error;
    }
  };

  const handleDeleteClick = async (banco: Banco) => {
    try {
      // Verificar se tem cartões associados antes de abrir o modal
      console.log("Verificando cartões para banco:", banco.id);
      const { hasCards, count } = await bancosService.hasCards(banco.id);

      let message = `Tem certeza que deseja excluir o banco "${banco.name}"?`;

      if (hasCards) {
        message = `Este banco possui ${count} cartão(ões) associado(s).\n\nAo deletar o banco, os cartões serão desvinculados (bank_id será NULL).\n\nDeseja continuar?`;
      }

      setDeleteConfirmation({
        isOpen: true,
        banco,
        message,
      });
    } catch (error) {
      console.error("Erro ao verificar cartões:", error);
      // Fallback em caso de erro na verificação
      setDeleteConfirmation({
        isOpen: true,
        banco,
        message: `Tem certeza que deseja excluir o banco "${banco.name}"?`,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.banco) return;

    try {
      setIsDeleting(true);
      console.log("Excluindo banco:", deleteConfirmation.banco.id);
      await bancosService.delete(deleteConfirmation.banco.id);
      console.log("Banco excluído com sucesso");

      setDeleteConfirmation({ isOpen: false, banco: null, message: "" });
      loadBancos();
      loadStats();
      addToast("Banco excluído com sucesso!", "success");
    } catch (error: any) {
      console.error("Erro ao excluir banco:", error);
      addToast(
        `Erro ao excluir: ${error.message || "Erro desconhecido"}`,
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (banco: Banco) => {
    setEditingBanco(banco);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBanco(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTipoLabel = (type: string) => {
    return TIPOS_BANCO.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Bancos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie suas contas bancárias e investimentos
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={20} />
          Novo Banco
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Saldo Total
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
                {formatCurrency(stats.total)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <DollarSign
                size={24}
                className="text-primary-600 dark:text-primary-400"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conta Corrente
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {stats.corrente}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2
                size={24}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Poupança
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {stats.poupanca}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Wallet
                size={24}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Investimento
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {stats.investimento}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TrendingUp
                size={24}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Buscar banco..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filters.type || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: (e.target.value as any) || undefined,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os tipos</option>
              {TIPOS_BANCO.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Lista de Bancos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw
            size={32}
            className="animate-spin text-primary-600 dark:text-primary-400"
          />
        </div>
      ) : bancos.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Nenhum banco encontrado.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus size={20} />
              Adicionar primeiro banco
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bancos.map((banco) => (
            <Card key={banco.id}>
              <div className="space-y-4">
                {/* Header do Card */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: banco.color + "20" }}
                    >
                      <Building2 size={24} style={{ color: banco.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {banco.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {getTipoLabel(banco.type)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Saldo */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatCurrency(banco.balance)}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(banco)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteClick(banco)}
                    className="gap-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <BancoForm
          banco={editingBanco}
          onSubmit={editingBanco ? handleUpdate : handleCreate}
          onCancel={handleCloseForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, banco: null, message: "" })
        }
        onConfirm={handleConfirmDelete}
        title="Excluir Banco"
        message={deleteConfirmation.message}
        isLoading={isDeleting}
      />
    </div>
  );
};
