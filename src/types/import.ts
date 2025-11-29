export type TransactionType = 'income' | 'expense';

export interface ImportedTransaction {
    id: string; // Temporary ID for the UI
    date: Date;
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    originalDescription: string; // To help with future categorization learning
    selected: boolean;
}

export interface ImportSummary {
    total: number;
    count: number;
    startDate: Date;
    endDate: Date;
}
