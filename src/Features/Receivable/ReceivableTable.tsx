"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Trash2, CircleDollarSign } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { receivableService } from "@/Service/receivableService";
import { Receivable } from "@/Type/receivable";
import AddReceiptModal from "./AddReceiptModal";

export default function ReceivableTable({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations("receivable");
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [receiptTarget, setReceiptTarget] = useState<Receivable | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Receivable | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchReceivables();
  }, [refreshKey]);

  async function fetchReceivables() {
    const res = await receivableService.listReceivables();
    setReceivables(res.data.receivables);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await receivableService.deleteReceivable(deleteTarget.id);
      toast.success(result.message || "Receivable deleted");
      setReceivables((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete receivable");
    } finally {
      setIsDeleting(false);
    }
  }

  const statusVariant: Record<string, string> = {
    pending: "bg-red-500/10 text-red-600",
    partial: "bg-yellow-500/10 text-yellow-600",
    received: "bg-green-500/10 text-green-600",
  };

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">{t("table.person")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.amount")}</TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">{t("table.received")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.due")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("table.status")}</TableHead>
              <TableHead className="text-right whitespace-nowrap">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receivables.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap">{r.personName}</TableCell>
                <TableCell className="whitespace-nowrap">{r.currency} {Number(r.amount).toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">
                  {r.currency} {Number(r.receivedAmount).toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">{format(new Date(r.dueDate), "PP")}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge className={statusVariant[r.status]} variant="secondary">{t(r.status)}</Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    {r.status !== "received" && (
                      <Button variant="ghost" size="icon" onClick={() => setReceiptTarget(r)}>
                        <CircleDollarSign className="size-4 text-green-600" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(r)}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddReceiptModal
        open={!!receiptTarget}
        onOpenChange={(v) => !v && setReceiptTarget(null)}
        receivable={receiptTarget}
        onSuccess={fetchReceivables}
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