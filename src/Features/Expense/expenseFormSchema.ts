import { z } from "zod";

export const expenseFormSchema = z.object({
  categoryId: z.string().uuid("Category is required"),
  // amount: z.coerce
  //   .number({ error: "Amount must be a number" })
  //   .positive("Amount must be greater than 0"),
  amount: z
    .number({ message: "Amount is required" })
    .positive("Amount must be greater than 0"),
  paymentMethod: z.string().optional(),
  note: z.string().optional(),
  date: z.date({ message: "Date is required" }),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
