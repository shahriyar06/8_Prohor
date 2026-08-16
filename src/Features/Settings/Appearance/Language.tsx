"use client";

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/store/languageStore";

const LANGUAGE_OPTIONS = [
  { value: "en" as const, label: "English" },
  { value: "bn" as const, label: "Bangla" },
];

export default function Language() {
  const t = useTranslations("settings.language");
  const { locale, setLocale } = useLanguageStore();

  const currentLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.value === locale)?.label ?? "English";

  return (
    <div>
      <div className="border border-border rounded-sm p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg">{t("title")}</h1>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  <Languages className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {LANGUAGE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setLocale(opt.value)}
                  className={
                    locale === opt.value ? "text-primary font-medium" : ""
                  }
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h1 className="text-muted-foreground text-sm mt-1.5 ml-3">
        {t("current")} <span className="text-primary">{currentLabel}</span>.
      </h1>
    </div>
  );
}
