"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import AddMemberModal from "./AddMemberModal";
import MembersTable from "./MembersTable";
import { organizationService } from "@/Service/organizationService";
import HeadCard from "@/components/common/HeadCard"; 
import users from "@/assets/Users.png"
import active from "@/assets/active.png"
import inactive from "@/assets/inactive.png"

export default function MemberDetails() {
  const t = useTranslations("member");
  const [modalOpen, setModalOpen] = useState(false);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    organizationService.getMyOrganization().then((res) => {
      setOrganizationId(res.data.organization.id);
    });
  }, []);

  if (!organizationId) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            {t("description")}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>{t("addMember")}</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard title="Total Users"  value="10" description="All registered users" icon={users}/>
        <HeadCard title="Active Users"  value="8" description="Users active on the platform" icon={active}/>
        <HeadCard title="Inactive Users"  value="2" description="Inactive users in your organization" icon={inactive}/>
      </div>

      <MembersTable organizationId={organizationId} refreshKey={refreshKey} />

      <AddMemberModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        organizationId={organizationId}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
}
