export interface Receita {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  recorrente: boolean;
  frequencia_recorrencia?: "mensal" | "semanal" | "anual" | null;
  observacoes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReceitaFormData {
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  recorrente: boolean;
  frequencia_recorrencia?: "mensal" | "semanal" | "anual" | null;
  observacoes?: string;
}

export interface ReceitaFilters {
  dataInicio?: string;
  dataFim?: string;
  categoria?: string;
  search?: string;
}

export const CATEGORIAS_RECEITA = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Aluguel",
  "Vendas",
  "Bonificação",
  "Outros",
] as const;

export type CategoriaReceita = (typeof CATEGORIAS_RECEITA)[number];
