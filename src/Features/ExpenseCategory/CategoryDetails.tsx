"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import AddCategoryModal from "./AddCategoryModal";
import CategoriesTable from "./CategoriesTable";

export default function CategoryDetails() {
  const t = useTranslations("expenseCategory");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-xs md:text-sm">{t("description")}</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>{t("addCategory")}</Button>
      </div>
      <hr className="mb-4 mt-2" />
      <CategoriesTable refreshKey={refreshKey} />
      <AddCategoryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}