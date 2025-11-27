export interface RelatorioFilters {
    startDate: string;
    endDate: string;
    category?: string;
    bankId?: string;
    cardId?: string;
}

export interface ChartData {
    name: string; // Data ou Mês
    receitas: number;
    despesas: number;
    saldo: number;
    [key: string]: any;
}

export interface CategoryData {
    name: string;
    value: number;
    color: string;
    percentage: number;
    [key: string]: any;
}

export interface PrevisaoItem {
    date: string;
    description: string;
    value: number;
    type: 'receita' | 'despesa';
    category: string;
    origin: 'recorrente' | 'parcelado';
}

export interface ResumoFinanceiro {
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
    maiorDespesa: { description: string; value: number; date: string };
    maiorReceita: { description: string; value: number; date: string };
}
