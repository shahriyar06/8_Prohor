"use client";
import HeadCard from "@/components/common/HeadCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import income from "@/assets/income.png";
import due from "@/assets/due.png";
import paid from "@/assets/paid.png";
import { useTranslations } from "next-intl";
import IncomeTable from "./IncomeTable";
import AddIncomeModal from "./AddIncomeModal";

export default function IncomeDetails() {
  const t = useTranslations("income");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Income</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Track and manage your income sources.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Income</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title="Total Income"
          value="$1,000"
          className="text-blue-500"
          description="All income sources"
          icon={income}
        />
        <HeadCard
          title="Total Paid"
          value="8"
          className="text-green-500"
          description="Successfully added income sources"
          icon={paid}
        />
        <HeadCard
          title="Total Due"
          value="2"
          className="text-red-500"
          description="Income sources waiting to be added"
          icon={due}
        />
      </div>

      <IncomeTable refreshKey={refreshKey} />
      <AddIncomeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
