// Tipos para o módulo de Bancos

export interface Banco {
  id: string;
  user_id: string;
  name: string;
  type: "corrente" | "poupanca" | "investimento";
  color: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface BancoFormData {
  name: string;
  type: "corrente" | "poupanca" | "investimento";
  color: string;
  balance: number;
}

export interface BancoFilters {
  search?: string;
  type?: "corrente" | "poupanca" | "investimento";
}

// Tipos de conta bancária
export const TIPOS_BANCO = [
  { value: "corrente", label: "Conta Corrente" },
  { value: "poupanca", label: "Poupança" },
  { value: "investimento", label: "Investimento" },
] as const;

// Cores predefinidas para bancos
export const CORES_BANCO = [
  { value: "#3B82F6", label: "Azul" },
  { value: "#10B981", label: "Verde" },
  { value: "#F59E0B", label: "Laranja" },
  { value: "#EF4444", label: "Vermelho" },
  { value: "#8B5CF6", label: "Roxo" },
  { value: "#EC4899", label: "Rosa" },
  { value: "#06B6D4", label: "Ciano" },
  { value: "#84CC16", label: "Lima" },
  { value: "#F97316", label: "Laranja Escuro" },
  { value: "#6366F1", label: "Índigo" },
] as const;
