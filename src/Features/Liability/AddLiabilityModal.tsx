"use client";

import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { liabilityFormSchema, LiabilityFormValues } from "./liabilityFormSchema";
import { liabilityService } from "@/Service/liabilityService";
import { cn } from "@/lib/utils";

interface AddLiabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddLiabilityModal({ open, onOpenChange, onSuccess }: AddLiabilityModalProps) {
  const t = useTranslations("liability");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register, handleSubmit, control, reset, formState: { errors },
  } = useForm<LiabilityFormValues>({
    resolver: zodResolver(liabilityFormSchema),
    defaultValues: { personName: "", amount: undefined, reason: "", dueDate: undefined, remindBeforeDays: undefined },
  });

  async function onSubmit(data: LiabilityFormValues) {
    setIsSubmitting(true);
    try {
      const result = await liabilityService.createLiability(data);
      toast.success(result.message || "Liability added");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to add liability");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>{t("addLiability")}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("personName")} *</Label>
            <Input {...register("personName")} />
            {errors.personName && <p className="text-sm text-red-500">{errors.personName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("amount")} *</Label>
            <Input type="number" step="0.01" {...register("amount")} />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("dueDate")} *</Label>
            <Controller
              name="dueDate"
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
            {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("reason")}</Label>
            <Input {...register("reason")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("remindBeforeDays")}</Label>
            <Input type="number" {...register("remindBeforeDays")} placeholder="3" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? t("adding") : t("addLiability")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}