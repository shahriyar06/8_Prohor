"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Trash2, CircleDollarSign } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { liabilityService } from "@/Service/liabilityService";
import { Liability } from "@/Type/liability";
import AddPaymentModal from "./AddPaymentModal";

export default function LiabilityTable({ refreshKey }: { refreshKey: number }) {
  const t = useTranslations("liability");
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [paymentTarget, setPaymentTarget] = useState<Liability | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Liability | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchLiabilities();
  }, [refreshKey]);

  async function fetchLiabilities() {
    const res = await liabilityService.listLiabilities();
    setLiabilities(res.data.liabilities);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await liabilityService.deleteLiability(deleteTarget.id);
      toast.success(result.message || "Liability deleted");
      setLiabilities((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete liability");
    } finally {
      setIsDeleting(false);
    }
  }

  const statusVariant: Record<string, string> = {
    pending: "bg-red-500/10 text-red-600",
    partial: "bg-yellow-500/10 text-yellow-600",
    paid: "bg-green-500/10 text-green-600",
  };

  console.log(liabilities);

  return (
    <>
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("table.person")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.amount")}
              </TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">
                {t("table.paid")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.due")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.status")}
              </TableHead>
              <TableHead className="whitespace-nowrap w-[250px] min-w-[250px] max-w-[250px]">
                {t("table.reason")}
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liabilities.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap">
                  {l.personName}
                </TableCell>
                <TableCell className="whitespace-nowrap text-red-600">
                  {l.currency} {Number(l.amount).toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap text-green-700">
                  {l.currency} {Number(l.paidAmount).toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(l.dueDate), "PP")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    className={statusVariant[l.status]}
                    variant="secondary"
                  >
                    {t(l.status)}
                  </Badge>
                </TableCell>
                <TableCell className="w-[250px] min-w-[250px] max-w-[250px] whitespace-normal">
                  {l.reason}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    {l.status !== "paid" && (
                      <Button
                        variant="update"
                        size="icon"
                        onClick={() => setPaymentTarget(l)}
                      >
                        <CircleDollarSign className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="delete"
                      size="icon"
                      onClick={() => setDeleteTarget(l)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddPaymentModal
        open={!!paymentTarget}
        onOpenChange={(v) => !v && setPaymentTarget(null)}
        liability={paymentTarget}
        onSuccess={fetchLiabilities}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancelDelete")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "..." : t("yesDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
