export interface Receivable {
  id: string;
  personName: string;
  amount: string;
  receivedAmount: string;
  currency: string;
  reason: string | null;
  dueDate: string;
  status: "pending" | "partial" | "received";
  remindBeforeDays: number | null;
}