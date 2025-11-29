export interface Meta {
    id: string;
    user_id: string;
    titulo: string;
    descricao?: string;
    valor_alvo: number;
    valor_atual: number;
    categoria: MetaCategoria;
    prazo: string; // ISO date
    status: MetaStatus;
    cor: string;
    created_at: string;
    updated_at: string;
}

export type MetaCategoria =
    | 'economia'
    | 'investimento'
    | 'compra'
    | 'viagem'
    | 'educacao'
    | 'emergencia'
    | 'outro';

export type MetaStatus =
    | 'em_andamento'
    | 'concluida'
    | 'cancelada'
    | 'atrasada';

export interface MetaFormData {
    titulo: string;
    descricao?: string;
    valor_alvo: number;
    valor_atual: number;
    categoria: MetaCategoria;
    prazo: string;
    cor: string;
}

export interface MetaContribuicao {
    id: string;
    meta_id: string;
    user_id: string;
    valor: number;
    data: string;
    observacao?: string;
    created_at: string;
}

export const META_CATEGORIAS: { value: MetaCategoria; label: string; icon: string }[] = [
    { value: 'economia', label: 'Economia', icon: 'PiggyBank' },
    { value: 'investimento', label: 'Investimento', icon: 'TrendingUp' },
    { value: 'compra', label: 'Compra', icon: 'ShoppingCart' },
    { value: 'viagem', label: 'Viagem', icon: 'Plane' },
    { value: 'educacao', label: 'Educação', icon: 'GraduationCap' },
    { value: 'emergencia', label: 'Emergência', icon: 'AlertTriangle' },
    { value: 'outro', label: 'Outro', icon: 'Target' },
];

export const META_CORES = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // orange
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange-dark
];
