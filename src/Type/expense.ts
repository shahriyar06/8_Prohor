export interface ExpenseCategory {
  id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Expense {
  id: string;
  amount: string;
  currency: string;
  paymentMethod: string | null;
  note: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  date: string;
  category: ExpenseCategory;
}
