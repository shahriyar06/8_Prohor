export interface IncomeCategory {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface Income {
  id: string;
  amount: string;
  currency: string;
  source: string | null;
  note: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  date: string;
  category: IncomeCategory;
}