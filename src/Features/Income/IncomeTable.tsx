"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { incomeService } from "@/Service/incomeService";
import { Income } from "@/Type/income";
import EditIncomeModal from "./EditIncomeModal";

export default function IncomeTable({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations("income");
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editTarget, setEditTarget] = useState<Income | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchIncomes();
  }, [refreshKey]);

  async function fetchIncomes() {
    const res = await incomeService.listIncomes();
    setIncomes(res.data.incomes);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await incomeService.deleteIncome(deleteTarget.id);
      toast.success(result.message || "Income deleted");
      setIncomes((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete income");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{t("table.date")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.category")}</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">{t("table.source")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.amount")}</TableHead>
              <TableHead className="text-right whitespace-nowrap">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(income.date), "PP")}</TableCell>
                <TableCell className="whitespace-nowrap">{income.category.name}</TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">{income.source ?? "—"}</TableCell>
                <TableCell className="whitespace-nowrap font-medium text-green-600">
                  +{income.currency} {Number(income.amount).toLocaleString()}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditTarget(income)}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(income)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditIncomeModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        income={editTarget}
        onSuccess={fetchIncomes}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("deleteConfirmDesc")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>{t("cancelDelete")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "..." : t("yesDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}