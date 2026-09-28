"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { receivableService } from "@/Service/receivableService";
import { Receivable } from "@/Type/receivable";

interface AddReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receivable: Receivable | null;
  onSuccess?: () => void;
}

interface ReceiptFormValues {
  amount: string;
}

export default function AddReceiptModal({
  open,
  onOpenChange,
  receivable,
  onSuccess,
}: AddReceiptModalProps) {
  const t = useTranslations("receivable");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReceiptFormValues>({
    defaultValues: { amount: "" },
  });

  if (!receivable) return null;

  const remaining =
    Number(receivable.amount) - Number(receivable.receivedAmount);

  const amountField = register("amount", {
    required: "Amount is required",
    validate: (value) => {
      const num = Number(value);
      if (isNaN(num) || value === "" || value === ".") {
        return "Enter a valid amount";
      }
      if (num <= 0) return "Amount must be greater than 0";
      if (num > remaining) {
        return `Amount cannot exceed remaining (${remaining.toLocaleString()})`;
      }
      return true;
    },
  });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
    }
    onOpenChange(nextOpen);
  }

  async function onSubmit(data: ReceiptFormValues) {
    setIsSubmitting(true);
    try {
      const result = await receivableService.addReceipt(
        receivable!.id,
        Number(data.amount),
      );
      toast.success(result.message || "Receipt recorded");
      handleOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to record receipt");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("addReceipt")}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {receivable.personName} — Remaining: {receivable.currency}{" "}
          {remaining.toLocaleString()}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("receiptAmount")}</Label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder={`Max ${remaining}`}
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

                if (value !== "" && value !== "." && Number(value) > remaining) {
                  value = String(remaining);
                }

                e.target.value = value;
                amountField.onChange(e);
              }}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
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
              {isSubmitting ? "..." : t("recordReceipt")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}