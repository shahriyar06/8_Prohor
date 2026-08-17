import { z } from "zod";

const checklistItemSchema = z.object({
  text: z.string().min(1, "Checklist item cannot be empty"),
});

export const taskFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  dueDate: z.date({ message: "Due date is required" }),
  dueTime: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  isRecurring: z.boolean(),
  recurrenceRule: z.string().optional(),
  tag: z.string().optional(),
  checklistItems: z.array(checklistItemSchema).optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;