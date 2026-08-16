"use client";

import { NextIntlClientProvider } from "next-intl";
import { useLanguageStore } from "@/store/languageStore";
import enMessages from "@/i18n/messages/en.json";
import bnMessages from "@/i18n/messages/bn.json";
import { useMounted } from "@/hooks/useMounted";

const MESSAGES = { en: enMessages, bn: bnMessages };

export function IntlProviderClient({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: "en" | "bn";
}) {
  const storeLocale = useLanguageStore((state) => state.locale);
  const mounted = useMounted();

  const activeLocale = mounted ? storeLocale : initialLocale;

  return (
    <NextIntlClientProvider
      locale={activeLocale}
      messages={MESSAGES[activeLocale]}
      timeZone="Asia/Dhaka"
    >
      {children}
    </NextIntlClientProvider>
  );
}
