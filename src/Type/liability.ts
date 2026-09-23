export interface Liability {
  id: string;
  personName: string;
  amount: string;
  paidAmount: string;
  currency: string;
  reason: string | null;
  dueDate: string;
  status: "pending" | "partial" | "paid";
  remindBeforeDays: number | null;
}