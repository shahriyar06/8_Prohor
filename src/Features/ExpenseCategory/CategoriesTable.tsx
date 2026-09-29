"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Pencil, Search, Trash2 } from "lucide-react";

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
import { expenseService } from "@/Service/expenseService";
import { ExpenseCategory } from "@/Type/expense";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CategoriesTableRef {
  refetch: () => void;
}

export default function CategoriesTable({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const t = useTranslations("expenseCategory");
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ExpenseCategory | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey, debouncedSearch, status]);

  async function fetchCategories() {
    const res = await expenseService.listCategories({
      search: debouncedSearch || undefined,
      status,
    });
    setCategories(res.data.categories);
  }

  function startEdit(cat: ExpenseCategory) {
    setEditingId(cat.id);
    setEditValue(cat.name);
  }

  async function saveEdit(id: string) {
    try {
      const result = await expenseService.updateCategory(id, {
        name: editValue,
      });
      toast.success(result.message || "Category updated");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Update failed");
    }
  }

  async function handleToggleActive(cat: ExpenseCategory, checked: boolean) {
    setTogglingId(cat.id);

    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: checked } : c)),
    );

    try {
      const result = await expenseService.updateCategory(cat.id, {
        isActive: checked,
      });
      toast.success(result.message || "Status updated");
    } catch (error) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, isActive: !checked } : c)),
      );
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await expenseService.deleteCategory(deleteTarget.id);
      toast.success(result.message || "Category deleted");
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to delete category");
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
        <Select value={status} onValueChange={(v) => setStatus(v ?? "all")}>
          <SelectTrigger className="md:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatus")}</SelectItem>
            <SelectItem value="active">{t("active")}</SelectItem>
            <SelectItem value="inactive">{t("inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("table.name")}</TableHead>
              <TableHead className="text-right">{t("table.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="whitespace-nowrap">
                  {editingId === cat.id ? (
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)}
                      className="max-w-[200px]"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      {cat.name}
                      {cat.isDefault && (
                        <Badge variant="secondary">{t("default")}</Badge>
                      )}
                      <Badge
                        variant="secondary"
                        className={cn(
                          cat.isActive
                            ? "bg-green-500/10 text-green-600"
                            : "bg-red-500/10 text-red-600",
                        )}
                      >
                        {cat.isActive ? t("active") : t("inactive")}
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {!cat.isDefault && (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t("activeToggle")}
                      </span>
                      <Switch
                        checked={cat.isActive}
                        disabled={togglingId === cat.id}
                        onCheckedChange={(checked) =>
                          handleToggleActive(cat, checked)
                        }
                      />
                      {editingId === cat.id ? (
                        <Button size="sm" onClick={() => saveEdit(cat.id)}>
                          {t("update")}
                        </Button>
                      ) : (
                        <Button
                          variant="edit"
                          size="icon"
                          onClick={() => startEdit(cat)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="delete"
                        size="icon"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {categories.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            {t("noResults")}
          </p>
        )}
      </div>

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
