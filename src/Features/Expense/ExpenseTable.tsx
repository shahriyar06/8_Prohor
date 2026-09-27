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

import { expenseService } from "@/Service/expenseService";
import { Expense } from "@/Type/expense";
import EditExpenseModal from "./EditExpenseModal";

export default function ExpenseTable({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations("expense");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [refreshKey]);

  async function fetchExpenses() {
    const res = await expenseService.listExpenses();
    setExpenses(res.data.expenses);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await expenseService.deleteExpense(deleteTarget.id);
      toast.success(result.message || "Expense deleted");
      setExpenses((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setIsDeleting(false);
    }
  }

  console.log(expenses)

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{t("table.date")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.category")}</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">{t("table.paymentMethod")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.amount")}</TableHead>
              <TableHead className="whitespace-nowrap w-[250px] min-w-[250px] max-w-[250px]">{t("table.note")}</TableHead>
              <TableHead className="text-right whitespace-nowrap">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(expense.date), "PP")}</TableCell>
                <TableCell className="whitespace-nowrap">{expense.category.name}</TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">
                  {expense.paymentMethod ? t(expense.paymentMethod === "mobile_banking" ? "mobileBanking" : expense.paymentMethod) : "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-red-600">
                  {expense.currency} {Number(expense.amount).toLocaleString()}
                </TableCell>
                <TableCell className="w-[250px] min-w-[250px] max-w-[250px] whitespace-normal break-words">
                  {expense.note} 
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button variant="edit" size="icon" onClick={() => setEditTarget(expense)}>
                      <Pencil className="size-4 text-blue-800" />
                    </Button>
                    <Button variant="delete" size="icon" onClick={() => setDeleteTarget(expense)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditExpenseModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        expense={editTarget}
        onSuccess={fetchExpenses}
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