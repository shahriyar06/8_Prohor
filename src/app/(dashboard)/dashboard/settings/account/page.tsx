"use client";

import ChangePassword from "@/Features/Settings/Account/ChangePassword";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const t = useTranslations("settings.account");

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-xs md:text-sm">
        {t("description")}
      </p>
      <hr className="mb-4 mt-1" />
      <div className="px-1">
        <ChangePassword />
      </div>
    </div>
  );
}
