"use client";
import HeadCard from "@/components/common/HeadCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import income from "@/assets/income.png";
import monthlyIn from "@/assets/MonthltI.png";
import dailyIn from "@/assets/DailyIn.png";
import { useTranslations } from "next-intl";
import IncomeTable from "./IncomeTable";
import AddIncomeModal from "./AddIncomeModal";
import { incomeService } from "@/Service/incomeService";

export default function IncomeDetails() {
  const t = useTranslations("income");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<{
    total: number;
    thisMonth: number;
    today: number;
  } | null>(null);

  useEffect(() => {
    incomeService.getSummary().then((res) => setSummary(res.data.summary));
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
        <Button onClick={() => setModalOpen(true)}>{t("addIncome")}</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title={t("totalIncome")}
          value={`৳${(summary?.total ?? 0).toLocaleString()}`}
          className="text-blue-500"
          description={t("totalIncomed")}
          icon={income}
        />
        <HeadCard
          title={t("thisMonthIncome")}
          value={`৳${(summary?.thisMonth ?? 0).toLocaleString()}`}
          className="text-green-500"
          description={t("thisMonthIncomed")}
          icon={monthlyIn}
        />
        <HeadCard
          title={t("todayIncome")}
          value={`৳${(summary?.today ?? 0).toLocaleString()}`}
          className="text-red-500"
          description={t("todayIncomed")}
          icon={dailyIn}
        />
      </div>

      <IncomeTable refreshKey={refreshKey} onDataChange={() => setRefreshKey((p) => p + 1)} />
      <AddIncomeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
