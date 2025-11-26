// Tipos para o módulo de Despesas

export interface Despesa {
    id: string;
    user_id: string;
    descricao: string;
    valor: number;
    data: string;
    categoria: string;
    tipo: 'fixa' | 'variavel';
    recorrente: boolean;
    frequencia_recorrencia?: 'semanal' | 'mensal' | 'anual';
    observacoes?: string;
    created_at: string;
    updated_at: string;
}

export interface DespesaFormData {
    descricao: string;
    valor: number;
    data: string;
    categoria: string;
    tipo: 'fixa' | 'variavel';
    recorrente: boolean;
    frequencia_recorrencia?: 'semanal' | 'mensal' | 'anual';
    observacoes?: string;
}

export interface DespesaFilters {
    search?: string;
    dataInicio?: string;
    dataFim?: string;
    categoria?: string;
    tipo?: 'fixa' | 'variavel';
}

// Categorias de despesas
export const CATEGORIAS_DESPESA = [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Serviços',
    'Impostos',
    'Outros'
] as const;

export const TIPOS_DESPESA = [
    { value: 'fixa', label: 'Fixa' },
    { value: 'variavel', label: 'Variável' }
] as const;
