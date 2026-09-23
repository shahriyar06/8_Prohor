import { z } from "zod";

export const incomeFormSchema = z.object({
  categoryId: z.string().uuid("Category is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  source: z.string().optional(),
  note: z.string().optional(),
  date: z.date({ message: "Date is required" }),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
});

export type IncomeFormValues = z.infer<typeof incomeFormSchema>;