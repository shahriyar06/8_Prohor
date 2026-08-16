"use client";

import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageStore } from "@/store/languageStore";
import { authService } from "@/Service/authService";
import { useHydratedLocale } from "@/hooks/useHydratedLocale";

const LANGUAGE_OPTIONS = [
  { value: "en" as const, label: "English" },
  { value: "bn" as const, label: "Bangla" },
];

export default function Language() {
  const t = useTranslations("settings.language");
  const { setLocale } = useLanguageStore();
  const activeLocale = useHydratedLocale();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.value === activeLocale)?.label ??
    "English";

  async function handleChange(value: "en" | "bn") {
    setLocale(value);
    setIsUpdating(true);
    try {
      await authService.updateLanguage(value);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(
        err.response?.data?.message || "Failed to save language preference",
      );
    } finally {
      setIsUpdating(false);
    }
  }

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
                <Button variant="outline" size="icon" disabled={isUpdating}>
                  <Languages className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {LANGUAGE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => handleChange(opt.value)}
                  className={
                    activeLocale === opt.value ? "text-primary font-medium" : ""
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
