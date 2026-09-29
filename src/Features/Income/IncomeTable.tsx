"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, Pencil, Search, Trash2, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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

import { incomeService } from "@/Service/incomeService";
import { Income } from "@/Type/income";
import EditIncomeModal from "./EditIncomeModal";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface IncomeTableProps {
  refreshKey: number;
  onDataChange?: () => void;
}

export default function IncomeTable({
  refreshKey,
  onDataChange,
}: IncomeTableProps) {
  const t = useTranslations("income");
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [editTarget, setEditTarget] = useState<Income | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchIncomes();
  }, [refreshKey, debouncedSearch, date, page]);

  async function fetchIncomes() {
    const res = await incomeService.listIncomes({
      search: debouncedSearch || undefined,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      page,
      limit: 15,
    });
    setIncomes(res.data.items);
    setTotalPages(res.data.pagination.totalPages);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await incomeService.deleteIncome(deleteTarget.id);
      toast.success(result.message || "Income deleted");
      setIncomes((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
      onDataChange?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete income");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      {/* Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative md:max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="md:w-48 justify-start font-normal"
              >
                <CalendarIcon className="mr-2 size-4" />
                {date ? format(date, "PP") : t("pickDate")}
              </Button>
            }
          />
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setPage(1);
              }}
            />
          </PopoverContent>
        </Popover>
        {(search || date) && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setDate(undefined);
              setPage(1);
            }}
          >
            <X className="size-4 mr-1" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("table.date")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.category")}
              </TableHead>
              <TableHead className="hidden md:table-cell whitespace-nowrap">
                {t("table.source")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("table.amount")}
              </TableHead>
              <TableHead className="whitespace-nowrap w-[300px] min-w-[300px] max-w-[300px]">
                {t("table.note")}
              </TableHead>
              <TableHead className="text-right whitespace-nowrap">
                {t("table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(income.date), "PP")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {income.category.name}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">
                  {income.source ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-green-600">
                  {income.currency} {Number(income.amount).toLocaleString()}
                </TableCell>
                <TableCell className="w-[300px] min-w-[300px] max-w-[300px] whitespace-normal break-words">
                  {income.note}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="edit"
                      size="icon"
                      onClick={() => setEditTarget(income)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="delete"
                      size="icon"
                      onClick={() => setDeleteTarget(income)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {incomes.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            {t("noResults")}
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          {t("page")} {page} {t("of")} {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {t("previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {t("next")}
          </Button>
        </div>
      </div>

      <EditIncomeModal
        open={!!editTarget}
        onOpenChange={(v) => !v && setEditTarget(null)}
        income={editTarget}
        // onSuccess={fetchIncomes}
        onSuccess={() => {
          fetchIncomes();
          onDataChange?.();
        }}
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
