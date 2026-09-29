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
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface LiabilityTableProps {
  refreshKey: number;
  onDataChange?: () => void;
}

export default function LiabilityTable({
  refreshKey,
  onDataChange,
}: LiabilityTableProps) {
  const t = useTranslations("liability");
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [paymentTarget, setPaymentTarget] = useState<Liability | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Liability | null>(null);
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
    fetchLiabilities();
  }, [refreshKey, debouncedSearch, date, status, page]);

  async function fetchLiabilities() {
    const res = await liabilityService.listLiabilities({
      search: debouncedSearch || undefined,
      date: date ? format(date, "yyyy-MM-dd") : undefined,
      status: status !== "all" ? status : undefined,
      page,
      limit: 15,
    });
    setLiabilities(res.data.items);
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
      const result = await liabilityService.deleteLiability(deleteTarget.id);
      toast.success(result.message || "Liability deleted");
      setLiabilities((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      setDeleteTarget(null);
      onDataChange?.();
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

  const hasFilters = search || date || status !== "all";

  const statusOptions = [
    { value: "all", label: t("allStatus") },
    { value: "pending", label: t("pending") },
    { value: "partial", label: t("partial") },
    { value: "paid", label: t("paid") },
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

      <AddPaymentModal
        open={!!paymentTarget}
        onOpenChange={(v) => !v && setPaymentTarget(null)}
        liability={paymentTarget}
        onSuccess={() => {
          fetchLiabilities();
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
