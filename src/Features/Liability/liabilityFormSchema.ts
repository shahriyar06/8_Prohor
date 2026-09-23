import { z } from "zod";

export const liabilityFormSchema = z.object({
  personName: z.string().min(2, "Person name is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  reason: z.string().optional(),
  dueDate: z.date({ message: "Due date is required" }),
  remindBeforeDays: z.coerce.number().int().positive().optional(),
});

export type LiabilityFormValues = z.infer<typeof liabilityFormSchema>;