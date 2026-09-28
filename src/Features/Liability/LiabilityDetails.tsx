"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import AddLiabilityModal from "./AddLiabilityModal";
import LiabilityTable from "./LiabilityTable";
import HeadCard from "@/components/common/HeadCard";
import Liability from "@/assets/Liability.png";
import PaidLia from "@/assets/PaidLia.png";
import PartialLia from "@/assets/PartialLia.png";
import PendingLia from "@/assets/PendingLia.png";
import { liabilityService } from "@/Service/liabilityService";

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

export default function LiabilityDetails() {
  const t = useTranslations("liability");
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    liabilityService.getSummary().then((res) => setSummary(res.data.summary));
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
        <Button onClick={() => setModalOpen(true)}>{t("addLiability")}</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-4 gap-3">
        <HeadCard
          title={t("totlaliability")}
          value={String(summary?.total ?? 0)}
          className="text-blue-500"
          description={t("totlaliabilitys")}
          icon={Liability}
        />
        <HeadCard
          title={t("paidliability")}
          value={String(summary?.paid ?? 0)}
          className="text-green-500"
          description={t("paidliabilitys")}
          icon={PaidLia}
        />
        <HeadCard
          title={t("partialliability")}
          value={String(summary?.partial ?? 0)}
          className="text-yellow-500"
          description={t("partialliabilitys")}
          icon={PartialLia}
        />
        <HeadCard
          title={t("pendingliability")}
          value={String(summary?.pending ?? 0)}
          className="text-red-500"
          description={t("pendingliabilitys")}
          icon={PendingLia}
        />
      </div>

      <LiabilityTable
        refreshKey={refreshKey}
        onDataChange={() => setRefreshKey((p) => p + 1)}
      />
      <AddLiabilityModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => setRefreshKey((p) => p + 1)}
      />
    </div>
  );
}
