import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;