"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Trash2, CircleDollarSign, CalendarIcon, X, Search } from "lucide-react";

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
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { receivableService } from "@/Service/receivableService";
import { Receivable } from "@/Type/receivable";
import AddReceiptModal from "./AddReceiptModal";
import { cn } from "@/lib/utils";

interface ReceivableTableProps {
  refreshKey: number;
  onDataChange?: () => void;
}

export default function ReceivableTable({
  refreshKey,
  onDataChange,
}: ReceivableTableProps) {
  const t = useTranslations("receivable");
  const [receivables, setReceivables] = useState<Receivable[]>([]);
  const [receiptTarget, setReceiptTarget] = useState<Receivable | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Receivable | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [status, setStatus] = useState("all");
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
    fetchReceivables();
  }, [refreshKey, debouncedSearch, date, status, page]);

  async function fetchReceivables() {
    const res = await receivableService.listReceivables({
      search: debouncedSearch || undefined,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      status: status !== "all" ? status : undefined,
      page,
      limit: 15,
    });
    setReceivables(res.data.items);
    setTotalPages(res.data.pagination.totalPages);
  }

  function clearFilters() {
    setSearch("");
    setDebouncedSearch("");
    setDate(undefined);
    setStatus("all");
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await receivableService.deleteReceivable(deleteTarget.id);
      toast.success(result.message || "Receivable deleted");
      setDeleteTarget(null);
      fetchReceivables();
      onDataChange?.();
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

  const hasFilters = search || date || status !== "all";

  const statusOptions = [
    { value: "all", label: t("allStatus") },
    { value: "pending", label: t("pending") },
    { value: "partial", label: t("partial") },
    { value: "received", label: t("received") },
  ];

  return (
    <>
      {/* Filters */}
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
                type="button"
                variant="outline"
                className={cn(
                  "justify-start font-normal md:w-48",
                  !date && "text-muted-foreground",
                )}
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

        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v ?? "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder={t("allStatus")}>
              {statusOptions.find((opt) => opt.value === status)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="mr-1 size-4" />
            {t("clearFilters")}
          </Button>
        )}
      </div>

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
                {t("table.received")}
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
            {receivables.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap">
                  {r.personName}
                </TableCell>
                <TableCell className="whitespace-nowrap text-green-700">
                  {r.currency} {Number(r.amount).toLocaleString()}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap text-red-600">
                  {r.currency} {Number(r.receivedAmount).toLocaleString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(r.dueDate), "PP")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Badge
                    className={statusVariant[r.status]}
                    variant="secondary"
                  >
                    {t(r.status)}
                  </Badge>
                </TableCell>
                <TableCell className="w-[250px] min-w-[250px] max-w-[250px] whitespace-normal">
                  {r.reason}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    {r.status !== "received" && (
                      <Button
                        variant="update"
                        size="icon"
                        onClick={() => setReceiptTarget(r)}
                      >
                        <CircleDollarSign className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="delete"
                      size="icon"
                      onClick={() => setDeleteTarget(r)}
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

      <AddReceiptModal
        open={!!receiptTarget}
        onOpenChange={(v) => !v && setReceiptTarget(null)}
        receivable={receiptTarget}
        onSuccess={() => {
          fetchReceivables();
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
