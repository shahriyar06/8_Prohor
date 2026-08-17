export type TaskPriority = "low" | "medium" | "high";

export interface ChecklistItemInput {
  text: string;
  order: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate: Date;
  dueTime?: string;
  priority: TaskPriority;
  isRecurring: boolean;
  recurrenceRule?: string;
  tag?: string;
  organizationId?: string; 
  checklistItems?: ChecklistItemInput[];
  assigneeMemberIds?: string[]; 
}