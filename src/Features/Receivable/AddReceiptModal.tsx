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

import { receivableService } from "@/Service/receivableService";
import { Receivable } from "@/Type/receivable";

interface AddReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receivable: Receivable | null;
  onSuccess?: () => void;
}

interface ReceiptFormValues {
  amount: number;
}

export default function AddReceiptModal({ open, onOpenChange, receivable, onSuccess }: AddReceiptModalProps) {
  const t = useTranslations("receivable");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<ReceiptFormValues>();

  if (!receivable) return null;

  const remaining = Number(receivable.amount) - Number(receivable.receivedAmount);

  async function onSubmit(data: ReceiptFormValues) {
    setIsSubmitting(true);
    try {
      const result = await receivableService.addReceipt(receivable!.id, Number(data.amount));
      toast.success(result.message || "Receipt recorded");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to record receipt");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{t("addReceipt")}</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">
          {receivable.personName} — Remaining: {receivable.currency} {remaining.toLocaleString()}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("receiptAmount")}</Label>
            <Input
              type="number"
              step="0.01"
              max={remaining}
              {...register("amount", { required: true, valueAsNumber: true, max: remaining })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : t("recordReceipt")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}