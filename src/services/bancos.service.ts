import { supabase } from "./supabase";
import type { Banco, BancoFormData, BancoFilters } from "../types/banco";

export const bancosService = {
  // Listar bancos com filtros
  async list(filters: BancoFilters = {}) {
    let query = supabase
      .from("banks")
      .select("*")
      .order("name", { ascending: true });

    // Aplicar filtros
    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }
    if (filters.type) {
      query = query.eq("type", filters.type);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Mapear campos do banco para o formato da aplicação
    const bancos = (data || []).map((item) => ({
      id: item.id,
      user_id: item.user_id,
      name: item.name,
      type: item.type,
      color: item.color || "#3B82F6",
      balance: item.balance || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return bancos as Banco[];
  },

  // Buscar banco por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("banks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    const banco = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      type: data.type,
      color: data.color || "#3B82F6",
      balance: data.balance || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return banco as Banco;
  },

  // Criar novo banco
  async create(banco: BancoFormData) {
    // Obter o usuário autenticado
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const bancoParaBanco = {
      user_id: user.id,
      name: banco.name,
      type: banco.type,
      color: banco.color,
      balance: banco.balance,
    };

    const { data, error } = await supabase
      .from("banks")
      .insert([bancoParaBanco])
      .select()
      .single();

    if (error) {
      throw error;
    }

    const bancoCriado = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      type: data.type,
      color: data.color || "#3B82F6",
      balance: data.balance || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return bancoCriado as Banco;
  },

  // Atualizar banco existente
  async update(id: string, banco: Partial<BancoFormData>) {
    const bancoParaBanco: any = {};
    if (banco.name !== undefined) bancoParaBanco.name = banco.name;
    if (banco.type !== undefined) bancoParaBanco.type = banco.type;
    if (banco.color !== undefined) bancoParaBanco.color = banco.color;
    if (banco.balance !== undefined) bancoParaBanco.balance = banco.balance;

    const { data, error } = await supabase
      .from("banks")
      .update(bancoParaBanco)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const bancoAtualizado = {
      id: data.id,
      user_id: data.user_id,
      name: data.name,
      type: data.type,
      color: data.color || "#3B82F6",
      balance: data.balance || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return bancoAtualizado as Banco;
  },

  // Verificar se banco tem cartões associados
  async hasCards(id: string): Promise<{ hasCards: boolean; count: number }> {
    const { error, count } = await supabase
      .from("cards")
      .select("id", { count: "exact", head: true })
      .eq("bank_id", id);

    if (error) {
      throw error;
    }

    return {
      hasCards: (count || 0) > 0,
      count: count || 0,
    };
  },

  // Deletar banco
  async delete(id: string) {
    // A verificação de cartões é feita no frontend para confirmação do usuário.
    // O banco de dados está configurado com ON DELETE SET NULL, então a integridade é mantida.

    const { error, count } = await supabase
      .from("banks")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (count === 0) {
      throw new Error(
        "Erro ao excluir: Registro não encontrado ou sem permissão.",
      );
    }

    return true;
  },

  // Obter estatísticas de bancos
  async getStats() {
    const { data, error } = await supabase
      .from("banks")
      .select("balance, type");

    if (error) {
      throw error;
    }

    const total = data.reduce(
      (sum: number, b: any) => sum + (b.balance || 0),
      0,
    );
    const corrente = data.filter((b: any) => b.type === "corrente").length;
    const poupanca = data.filter((b: any) => b.type === "poupanca").length;
    const investimento = data.filter(
      (b: any) => b.type === "investimento",
    ).length;

    return {
      total,
      corrente,
      poupanca,
      investimento,
      quantidade: data.length,
    };
  },
};
