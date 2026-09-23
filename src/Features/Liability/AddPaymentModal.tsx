"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import { liabilityService } from "@/Service/liabilityService";
import { Liability } from "@/Type/liability";

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  liability: Liability | null;
  onSuccess?: () => void;
}

interface PaymentFormValues {
  amount: number;
}

export default function AddPaymentModal({ open, onOpenChange, liability, onSuccess }: AddPaymentModalProps) {
  const t = useTranslations("liability");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<PaymentFormValues>();

  if (!liability) return null;

  const remaining = Number(liability.amount) - Number(liability.paidAmount);

  async function onSubmit(data: PaymentFormValues) {
    setIsSubmitting(true);
    try {
      const result = await liabilityService.addPayment(liability!.id, Number(data.amount));
      toast.success(result.message || "Payment recorded");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{t("addPayment")}</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">
          {liability.personName} — Remaining: {liability.currency} {remaining.toLocaleString()}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("paymentAmount")}</Label>
            <Input
              type="number"
              step="0.01"
              max={remaining}
              {...register("amount", { required: true, valueAsNumber: true, max: remaining })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t("recordPayment")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}