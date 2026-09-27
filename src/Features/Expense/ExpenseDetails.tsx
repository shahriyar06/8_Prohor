"use client";
import HeadCard from "@/components/common/HeadCard";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddExpenseModal from "./AddExpenseModal";
import ExpenseTable from "./ExpenseTable";
import expense from "@/assets/Expense.png"
import monthlyex from "@/assets/MonthlyEX.png"
import dailyex from "@/assets/DailyEx.png"

export default function ExpenseDetails() {
  const t = useTranslations("expense");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Track and manage your expense sources.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Expense</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title="Total Expense"
          value="$500"
          className="text-blue-500"
          description="All expenses combined"
          icon={expense}
        />
        <HeadCard
          title="This Month's Expense"
          value="$200"
          className="text-green-500"
          description="Expenses this month"
          icon={monthlyex}
        />
        <HeadCard
          title="Average Daily Expense"
          value="$20"
          className="text-red-500"
          description="Average spending per day"
          icon={dailyex}
        />
      </div>


      <ExpenseTable refreshKey={refreshKey} />
      <AddExpenseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
