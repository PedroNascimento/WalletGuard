export interface Orcamento {
    id: string;
    user_id: string;
    nome: string;
    mes: number; // 1-12
    ano: number;
    valor_total: number;
    valor_gasto: number;
    categorias: OrcamentoCategoria[];
    status: OrcamentoStatus;
    created_at: string;
    updated_at: string;
}

export interface OrcamentoCategoria {
    categoria: string;
    valor_planejado: number;
    valor_gasto: number;
    cor: string;
}

export type OrcamentoStatus =
    | 'ativo'
    | 'concluido'
    | 'excedido';

export interface OrcamentoFormData {
    nome: string;
    mes: number;
    ano: number;
    categorias: OrcamentoCategoria[];
}

export const MESES = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
];

export const CATEGORIAS_ORCAMENTO = [
    { value: 'alimentacao', label: 'Alimentação', cor: '#10B981' },
    { value: 'transporte', label: 'Transporte', cor: '#3B82F6' },
    { value: 'moradia', label: 'Moradia', cor: '#F59E0B' },
    { value: 'saude', label: 'Saúde', cor: '#EF4444' },
    { value: 'educacao', label: 'Educação', cor: '#8B5CF6' },
    { value: 'lazer', label: 'Lazer', cor: '#EC4899' },
    { value: 'vestuario', label: 'Vestuário', cor: '#14B8A6' },
    { value: 'servicos', label: 'Serviços', cor: '#F97316' },
    { value: 'investimentos', label: 'Investimentos', cor: '#06B6D4' },
    { value: 'outros', label: 'Outros', cor: '#6B7280' },
];
