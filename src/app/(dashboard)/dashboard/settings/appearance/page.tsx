"use client";

import Language from "@/Features/Settings/Appearance/Language";
import Theme from "@/Features/Settings/Appearance/Theme";
import { useTranslations } from "next-intl";

export default function AppearancePage() {
  const t = useTranslations("settings.appearance");
  return (
    <div>
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <p className="text-muted-foreground text-xs md:text-sm">{t("description")}</p>
      <hr className="mb-4 mt-2" />
      <div className="px-1 space-y-10">
        <Theme />
        <Language />
      </div>
    </div>
  );
}