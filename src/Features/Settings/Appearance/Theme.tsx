"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";

export default function Theme() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings.theme");
  const mounted = useMounted();

  const THEME_OPTIONS = [
    { value: "light", label: t("light"), icon: Sun },
    { value: "dark", label: t("dark"), icon: Moon },
    { value: "system", label: t("system"), icon: Monitor },
  ];

  const currentOption =
    THEME_OPTIONS.find((opt) => opt.value === theme) ?? THEME_OPTIONS[2];
  const CurrentIcon = currentOption.icon;

  return (
    <div>
      <div className="border border-border rounded-sm p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg">{t("title")}</h1>
            <p className="text-muted-foreground text-xs md:text-sm">{t("description")}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon">
                  {mounted ? (
                    <CurrentIcon className="size-4" />
                  ) : (
                    <Sun className="size-4" />
                  )}
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              {THEME_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={
                    theme === opt.value ? "text-primary font-medium" : ""
                  }
                >
                  <opt.icon className="size-4 mr-2" />
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h1 className="text-muted-foreground text-sm mt-1.5 ml-3">
        {t("current")}{" "}
        <span className="text-primary">
          {mounted ? currentOption.label : t("system")}
        </span>
        .
      </h1>
    </div>
  );
}
