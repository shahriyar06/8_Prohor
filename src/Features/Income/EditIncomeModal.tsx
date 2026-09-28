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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { incomeFormSchema, IncomeFormValues } from "./incomeFormSchema";
import { incomeService } from "@/Service/incomeService";
import { Income, IncomeCategory } from "@/Type/income";
import { cn } from "@/lib/utils";

interface EditIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: Income | null;
  onSuccess?: () => void;
}

export default function EditIncomeModal({
  open,
  onOpenChange,
  income,
  onSuccess,
}: EditIncomeModalProps) {
  const t = useTranslations("income");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<IncomeCategory[]>([]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
  });

  const amountField = register("amount");

  useEffect(() => {
    if (open) {
      // incomeService
      //   .listCategories()
      //   .then((res) => setCategories(res.data.categories));
      incomeService
        .listCategories(true)
        .then((res) => setCategories(res.data.categories));
    }
    if (open && income) {
      reset({
        categoryId: income.category.id,
        amount: Number(income.amount),
        source: income.source ?? "",
        note: income.note ?? "",
        date: new Date(income.date),
        isRecurring: income.isRecurring,
        recurrenceRule: income.recurrenceRule ?? "",
      });
    }
  }, [open, income, reset]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  async function onSubmit(data: IncomeFormValues) {
    if (!income) return;
    setIsSubmitting(true);
    try {
      const result = await incomeService.updateIncome(income.id, data);
      toast.success(result.message || "Income updated");
      handleOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update income");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!income) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("addIncome")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("category")} *</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("category")}>
                        {field.value
                          ? categories.find((cat) => cat.id === field.value)
                              ?.name
                          : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("amount")} *</Label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="1000"
                {...amountField}
                onKeyDown={(e) => {
                  if (["-", "+", "e", "E"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  let value = e.target.value;
                  value = value.replace(/[^0-9.]/g, "");
                  const parts = value.split(".");
                  if (parts.length > 2) {
                    value = parts[0] + "." + parts.slice(1).join("");
                  }
                  e.target.value = value;
                  // amountField.onChange({
                  //   target: {
                  //     name: "amount",
                  //     value: value === "" ? undefined : Number(value),
                  //   },
                  // });
                  amountField.onChange(e);
                }}
              />
              {errors.amount && (
                <p className="text-sm text-red-500">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div className="flex flex-col gap-1.5">
              <Label>{t("date")} *</Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      }
                    />
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>{t("source")}</Label>
              <Input {...register("source")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("note")}</Label>
            <Textarea {...register("note")} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "..." : t("update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
