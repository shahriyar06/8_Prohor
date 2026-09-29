"use client";
import HeadCard from "@/components/common/HeadCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseTable from "./ExpenseTable";
import expense from "@/assets/Expense.png";
import monthlyex from "@/assets/MonthlyEX.png";
import dailyex from "@/assets/DailyEx.png";
import { expenseService } from "@/Service/expenseService";

export default function ExpenseDetails() {
  const t = useTranslations("expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<{
    total: number;
    thisMonth: number;
    today: number;
  } | null>(null);

  useEffect(() => {
    expenseService.getSummary().then((res) => setSummary(res.data.summary));
  }, [refreshKey]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t("description")}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>{t("addExpense")}</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title={t("totalExpense")}
          value={`৳${(summary?.total ?? 0).toLocaleString()}`}
          className="text-blue-500"
          description={t("totalExpenseDesc")}
          icon={expense}
        />
        <HeadCard
          title={t("monthlyExpense")}
          value={`৳${(summary?.thisMonth ?? 0).toLocaleString()}`}
          className="text-green-500"
          description={t("monthlyExpenseDesc")}
          icon={monthlyex}
        />
        <HeadCard
          title={t("todayExpense")}
          value={`৳${(summary?.today ?? 0).toLocaleString()}`}
          className="text-red-500"
          description={t("todayExpenseDesc")}
          icon={dailyex}
        />
      </div>

      <ExpenseTable
        refreshKey={refreshKey}
        onDataChange={() => setRefreshKey((p) => p + 1)}
      />
      <AddExpenseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
