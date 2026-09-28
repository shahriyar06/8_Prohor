"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import AddReceivableModal from "./AddReceivableModal";
import ReceivableTable from "./ReceivableTable";
import HeadCard from "@/components/common/HeadCard";
import { receivableService } from "@/Service/receivableService";
import Receivable from "@/assets/Receivable.png";
import PaidRec from "@/assets/PaidRec.png";
import PartialRec from "@/assets/PartialRec.png";
import PendingRec from "@/assets/PendingRec.png";

interface Summary {
  total: number;
  totalAmount: number;
  paid: number;
  paidAmount: number;
  partial: number;
  partialAmount: number;
  pending: number;
  pendingAmount: number;
}

export default function ReceivableDetails() {
  const t = useTranslations("receivable");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    receivableService.getSummary().then((res) => setSummary(res.data.summary));
  }, [refreshKey]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t("description")}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>{t("addReceivable")}</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <HeadCard
          title={t("totalreceivable")}
          value={String(summary?.total ?? 0)}
          className="text-blue-500"
          description={t("totalreceivables")}
          icon={Receivable}
        />
        <HeadCard
          title={t("paidreceivable")}
          value={String(summary?.paid ?? 0)}
          className="text-green-500"
          description={t("paidreceivables")}
          icon={PaidRec}
        />
        <HeadCard
          title={t("partialreceivable")}
          value={String(summary?.partial ?? 0)}
          className="text-yellow-500"
          description={t("partialreceivables")}
          icon={PartialRec}
        />
        <HeadCard
          title={t("pendingreceivable")}
          value={String(summary?.pending ?? 0)}
          className="text-red-500"
          description={t("pendingreceivables")}
          icon={PendingRec}
        />
      </div>

      <ReceivableTable
        refreshKey={refreshKey}
        onDataChange={() => setRefreshKey((p) => p + 1)}
      />

      <AddReceivableModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
