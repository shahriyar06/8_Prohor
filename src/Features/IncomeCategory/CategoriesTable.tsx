"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Pencil, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
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
import { IncomeCategory } from "@/Type/income";
import { incomeService } from "@/Service/incomeService";
import { cn } from "@/lib/utils";

export interface CategoriesTableRef {
  refetch: () => void;
}

export default function CategoriesTable({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const t = useTranslations("incomeCategory");
  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IncomeCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [refreshKey]);

  async function fetchCategories() {
    const res = await incomeService.listCategories();
    setCategories(res.data.categories);
  }

  function startEdit(cat: IncomeCategory) {
    setEditingId(cat.id);
    setEditValue(cat.name);
  }

  async function saveEdit(id: string) {
    try {
      const result = await incomeService.updateCategory(id, {
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

  async function handleToggleActive(cat: IncomeCategory, checked: boolean) {
    setTogglingId(cat.id);

    // Optimistic update: UI সাথে সাথে বদলে যাবে
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, isActive: checked } : c)),
    );

    try {
      const result = await incomeService.updateCategory(cat.id, {
        isActive: checked,
      });
      toast.success(result.message || "Status updated");
    } catch (error) {
      // ফেইল করলে আগের অবস্থায় ফেরত
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
      const result = await incomeService.deleteCategory(deleteTarget.id);
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
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(cat)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(cat)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
