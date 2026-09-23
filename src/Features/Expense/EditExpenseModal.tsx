"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import { expenseFormSchema, ExpenseFormValues } from "./expenseFormSchema";
import { expenseService } from "@/Service/expenseService";
import { Expense, ExpenseCategory } from "@/Type/expense";
import { cn } from "@/lib/utils";

interface EditExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
  onSuccess?: () => void;
}

export default function EditExpenseModal({ open, onOpenChange, expense, onSuccess }: EditExpenseModalProps) {
  const t = useTranslations("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);

  const {
    register, handleSubmit, control, reset, formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
  });

  useEffect(() => {
    if (open) {
      expenseService.listCategories().then((res) => setCategories(res.data.categories));
    }
    if (open && expense) {
      reset({
        categoryId: expense.category.id,
        amount: Number(expense.amount),
        paymentMethod: expense.paymentMethod ?? "",
        note: expense.note ?? "",
        date: new Date(expense.date),
        isRecurring: expense.isRecurring,
        recurrenceRule: expense.recurrenceRule ?? "",
      });
    }
  }, [open, expense, reset]);

  async function onSubmit(data: ExpenseFormValues) {
    if (!expense) return;
    setIsSubmitting(true);
    try {
      const result = await expenseService.updateExpense(expense.id, data);
      toast.success(result.message || "Expense updated");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update expense");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("addExpense")}</DialogTitle></DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("category")} *</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("amount")} *</Label>
            <Input type="number" step="0.01" {...register("amount")} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("date")} *</Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button type="button" variant="outline" className={cn("justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                      </Button>
                    }
                  />
                  <PopoverContent className="p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("paymentMethod")}</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t("cash")}</SelectItem>
                    <SelectItem value="card">{t("card")}</SelectItem>
                    <SelectItem value="mobile_banking">{t("mobileBanking")}</SelectItem>
                    <SelectItem value="bank">{t("bank")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("note")}</Label>
            <Textarea {...register("note")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t("update")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}