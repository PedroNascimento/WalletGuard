export interface Card {
  id: string;
  user_id: string;
  bank_id?: string;
  name: string;
  brand?: string;
  limit_amount: number;
  closing_day: number;
  due_day: number;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface CardFormData {
  name: string;
  bank_id?: string;
  limit_amount: number;
  closing_day: number;
  due_day: number;
  color: string;
  brand?: string;
}

export interface CardExpense {
  id: string;
  user_id: string;
  card_id: string;
  description: string;
  value: number;
  date: string;
  category: string;
  installments: number;
  installment_current: number;
  original_amount?: number;
  created_at?: string;
}

export interface CardExpenseFormData {
  description: string;
  value: number;
  date: string;
  category: string;
  installments: number;
}

export interface InvoiceSummary {
  month: number;
  year: number;
  total: number;
  status: "open" | "closed" | "future";
  dueDate: string;
  closingDate: string;
}
