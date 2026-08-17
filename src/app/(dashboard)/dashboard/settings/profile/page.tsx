"use client";

import { useTranslations } from "next-intl";
import ProfileInfo from "@/Features/Settings/Profile/ProfileInfo";

export default function ProfilePage() {
  const t = useTranslations("settings.profile");

  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-xs md:text-sm">
        {t("description")}
      </p>
      <hr className="mb-4 mt-2" />
      <div className="px-1">
        <ProfileInfo />
      </div>
    </div>
  );
}